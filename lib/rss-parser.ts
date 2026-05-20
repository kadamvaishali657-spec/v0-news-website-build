'use server';

import { logger } from './logger';

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  image?: string;
  source: string;
  category?: string;
}

export interface RSSFeed {
  url: string;
  title: string;
  category?: string;
}

/**
 * Parse RSS feed with retry logic and error handling
 */
export async function parseFeed(
  feedUrl: string,
  feedTitle: string,
  category?: string,
  retries = 2
): Promise<Article[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      logger.debug(`Fetching RSS feed: ${feedTitle}`, { feedUrl, attempt });

      const response = await fetch(`/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        if (attempt === retries) {
          logger.error(`Failed to fetch feed after ${retries + 1} attempts`, {
            feedTitle,
            feedUrl,
            status: response.status,
          });
          return [];
        }
        await sleep(1000 * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }

      const data = await response.json();
      if (data.content) {
        const articles = await parseFeedContent(data.content, feedTitle, category);
        logger.debug(`Successfully parsed ${articles.length} articles from ${feedTitle}`);
        return articles;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn(`Feed parsing error (attempt ${attempt + 1}/${retries + 1})`, {
        feedTitle,
        error: errorMessage,
      });

      if (attempt === retries) {
        logger.error(`Failed to parse feed: ${feedTitle}`, { feedUrl, error: errorMessage });
        return [];
      }

      await sleep(1000 * Math.pow(2, attempt));
    }
  }

  return [];
}

/**
 * Parse XML content and extract articles
 */
async function parseFeedContent(
  text: string | null,
  feedTitle: string,
  category?: string
): Promise<Article[]> {
  try {
    if (!text || typeof text !== 'string') {
      logger.warn(`Invalid feed content for ${feedTitle}`);
      return [];
    }

    // Use a simple regex-based parser for better reliability
    const articles: Article[] = [];

    // Try to parse as XML first
    let items: any[] = [];
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        throw new Error('XML parsing error');
      }

      items = Array.from(xmlDoc.querySelectorAll('item, entry'));
    } catch (e) {
      // Fallback: Try regex extraction
      logger.debug(`Falling back to regex parsing for ${feedTitle}`);
      const itemRegex = /<(item|entry)[^>]*>([\s\S]*?)<\/(item|entry)>/g;
      let match;
      while ((match = itemRegex.exec(text)) !== null) {
        items.push(match[2]);
      }
    }

    if (items.length === 0) {
      logger.warn(`No articles found in feed: ${feedTitle}`);
      return [];
    }

    items.forEach((item, index) => {
      try {
        let title = '';
        let link = '';
        let description = '';
        let pubDate = new Date().toISOString();
        let image: string | undefined;

        if (typeof item === 'string') {
          // Regex extraction
          title = extractValue(item, 'title') || 'No title';
          link = extractValue(item, 'link') || '';
          description = extractValue(item, 'description') || extractValue(item, 'summary') || '';
          pubDate = extractValue(item, 'pubDate') || extractValue(item, 'published') || new Date().toISOString();
          image = extractImageUrl(item);
        } else {
          // DOM extraction
          title = item.querySelector('title')?.textContent || 'No title';
          link = item.querySelector('link')?.textContent || item.querySelector('link[href]')?.getAttribute('href') || '';
          description = item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent || '';
          pubDate = item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || new Date().toISOString();
          image = extractImageFromDOM(item);
        }

        // Validate essential data
        link = link.trim();
        if (!link || !title.trim()) {
          return;
        }

        // Validate URL
        try {
          new URL(link);
        } catch {
          logger.debug(`Invalid URL skipped from ${feedTitle}:`, link);
          return;
        }

        const article: Article = {
          id: `${feedTitle}-${index}-${Date.now()}-${Math.random()}`,
          title: cleanText(title).substring(0, 200),
          description: cleanText(description).substring(0, 250),
          link,
          pubDate: new Date(pubDate),
          image: image && image.trim().length > 0 ? image.trim() : undefined,
          source: feedTitle,
          category,
        };

        articles.push(article);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.debug(`Error parsing item from ${feedTitle}:`, errorMessage);
      }
    });

    return articles;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to parse feed content for ${feedTitle}:`, errorMessage);
    return [];
  }
}

/**
 * Extract image from various RSS formats
 */
function extractImageFromDOM(item: any): string | undefined {
  // Try media:content
  let mediaContent = item.querySelector('media\\:content[url], media\\:content[medium="image"]');
  if (mediaContent?.getAttribute('url')) {
    return mediaContent.getAttribute('url');
  }

  // Try media:thumbnail
  let mediaThumb = item.querySelector('media\\:thumbnail, thumbnail');
  if (mediaThumb?.getAttribute('url')) {
    return mediaThumb.getAttribute('url');
  }

  // Try enclosure
  let enclosure = item.querySelector('enclosure');
  if (enclosure?.getAttribute('type')?.includes('image/')) {
    return enclosure.getAttribute('url') || undefined;
  }

  // Try to find image in content
  const content = item.querySelector('content\\:encoded')?.textContent || item.querySelector('description')?.textContent || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) {
    return imgMatch[1];
  }

  return undefined;
}

/**
 * Extract image from regex-parsed content
 */
function extractImageUrl(content: string): string | undefined {
  // Try media:content
  let match = content.match(/<media:content[^>]*url=["']([^"']+)["']/);
  if (match?.[1]) return match[1];

  // Try media:thumbnail
  match = content.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/);
  if (match?.[1]) return match[1];

  // Try enclosure
  match = content.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/);
  if (match?.[1]) return match[1];

  // Try img tag in description
  match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return match[1];

  return undefined;
}

/**
 * Extract value from regex-parsed XML
 */
function extractValue(content: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = content.match(regex);
  return match?.[1] || '';
}

/**
 * Clean HTML and decode entities
 */
function cleanText(text: string): string {
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  try {
    if (typeof window !== 'undefined') {
      const txt = document.createElement('textarea');
      txt.innerHTML = clean;
      return txt.value;
    }
  } catch {
    // Fallback for server-side
    clean = clean
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
  return clean;
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch all feeds with error handling
 */
export async function fetchAllFeeds(feeds: RSSFeed[]): Promise<Article[]> {
  logger.debug(`Fetching ${feeds.length} RSS feeds`);

  try {
    const results = await Promise.allSettled(
      feeds.map((feed) => parseFeed(feed.url, feed.title, feed.category))
    );

    const articles = results
      .map((result) => (result.status === 'fulfilled' ? result.value : []))
      .flat();

    logger.info(`Fetched ${articles.length} total articles from ${feeds.length} feeds`);

    if (articles.length === 0) {
      logger.warn('No articles fetched from any feed, using fallback data');
      return FALLBACK_ARTICLES;
    }

    // Sort by date
    articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    return articles;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Critical error in fetchAllFeeds:', errorMessage);
    return FALLBACK_ARTICLES;
  }
}

/**
 * Default RSS feeds
 */
export const DEFAULT_FEEDS: RSSFeed[] = [
  // Global News - Premium Sources
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', title: 'New York Times', category: 'Global News' },
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World News', category: 'Global News' },
  { url: 'https://feeds.reuters.com/reuters/topNews', title: 'Reuters Top News', category: 'Global News' },
  { url: 'https://www.theguardian.com/world/rss', title: 'The Guardian World', category: 'Global News' },
  { url: 'https://feeds.npr.org/1001/rss.xml', title: 'NPR News', category: 'Global News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', title: 'Al Jazeera English', category: 'Global News' },
  { url: 'https://www.reddit.com/r/worldnews/.rss', title: 'Reddit r/worldnews', category: 'Global News' },

  // Technology
  { url: 'https://techcrunch.com/feed/', title: 'TechCrunch', category: 'Technology' },
  { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', category: 'Technology' },
  { url: 'https://www.wired.com/feed/rss', title: 'WIRED', category: 'Technology' },
  { url: 'http://feeds.arstechnica.com/arstechnica/index', title: 'Ars Technica', category: 'Technology' },
  { url: 'https://venturebeat.com/feed/', title: 'VentureBeat', category: 'Technology' },
  { url: 'https://news.ycombinator.com/rss', title: 'Hacker News', category: 'Technology' },
  { url: 'https://www.engadget.com/rss.xml', title: 'Engadget', category: 'Technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', title: 'NY Times Technology', category: 'Technology' },
  { url: 'https://www.reddit.com/r/technology/.rss', title: 'Reddit r/technology', category: 'Technology' },

  // Business & Finance
  { url: 'https://feeds.bloomberg.com/markets/news.rss', title: 'Bloomberg Markets', category: 'Business' },
  { url: 'https://www.entrepreneur.com/latest.rss', title: 'Entrepreneur', category: 'Business' },
  { url: 'https://www.fastcompany.com/rss', title: 'Fast Company', category: 'Business' },
  { url: 'https://www.forbes.com/feed/', title: 'Forbes', category: 'Business' },
  { url: 'https://feeds.ft.com/home/rss', title: 'Financial Times', category: 'Business' },

  // Science & Health
  { url: 'https://feeds.nature.com/nature/rss/current', title: 'Nature', category: 'Science' },
  { url: 'https://feeds.sciencedaily.com/sciencedaily.rss', title: 'Science Daily', category: 'Science' },
  { url: 'https://www.medicalnewstoday.com/rss.xml', title: 'Medical News Today', category: 'Science' },

  // Sports
  { url: 'https://www.espn.com/espn/rss/news', title: 'ESPN Top Headlines', category: 'Sports' },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', title: 'BBC Sport', category: 'Sports' },
  { url: 'https://www.reddit.com/r/sports/.rss', title: 'Reddit r/sports', category: 'Sports' },

  // Entertainment
  { url: 'https://www.rollingstone.com/feed/', title: 'Rolling Stone', category: 'Entertainment' },
  { url: 'https://variety.com/feed/', title: 'Variety', category: 'Entertainment' },
  { url: 'https://feeds.theguardian.com/theguardian/film/rss', title: 'The Guardian Film', category: 'Entertainment' },
  { url: 'https://www.hollywoodreporter.com/feed/rss.xml', title: 'Hollywood Reporter', category: 'Entertainment' },

  // Education & Learning
  { url: 'https://feeds.feedburner.com/tedtalks_video', title: 'TED Talks', category: 'Education' },
  { url: 'https://www.khanacademy.org/about/blog/rss.xml', title: 'Khan Academy', category: 'Education' },
  { url: 'https://seths.blog/feed', title: 'Seth Godin', category: 'Education' },
  { url: 'https://tim.blog/feed/', title: 'Tim Ferriss Blog', category: 'Education' },

  // Lifestyle
  { url: 'https://www.boredpanda.com/feed/', title: 'Bored Panda', category: 'Lifestyle' },
  { url: 'https://www.mentalfloss.com/rss.xml', title: 'Mental Floss', category: 'Lifestyle' },
  { url: 'https://www.reddit.com/r/lifeprotips/.rss', title: 'Reddit r/lifeprotips', category: 'Lifestyle' },

  // Politics
  { url: 'https://feeds.theguardian.com/theguardian/politics/rss', title: 'The Guardian Politics', category: 'Politics' },
  { url: 'https://feeds.politico.com/playbook.rss', title: 'Politico', category: 'Politics' },

  // Environment
  { url: 'https://feeds.theguardian.com/theguardian/environment/rss', title: 'The Guardian Environment', category: 'Environment' },
  { url: 'https://www.mongabay.com/feed/', title: 'Mongabay', category: 'Environment' },
];

/**
 * Fallback articles for when feeds are unavailable
 */
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to Informed News Aggregator',
    description: 'Stay updated with the latest news from 40+ trusted sources across technology, business, science, and more. RSS feeds will load shortly.',
    link: 'https://informed.tech',
    pubDate: new Date(),
    source: 'Informed',
    category: 'News',
  },
  {
    id: 'fallback-2',
    title: 'Global Tech News Aggregation',
    description: 'Our platform curates content from TechCrunch, The Verge, Ars Technica, and many more premium tech publications.',
    link: 'https://informed.tech',
    pubDate: new Date(Date.now() - 3600000),
    source: 'Informed',
    category: 'Technology',
  },
  {
    id: 'fallback-3',
    title: 'AI-Powered Content Summarization',
    description: 'Get quick summaries of any article with our AI-powered feature. Enable summaries from the controls above.',
    link: 'https://informed.tech',
    pubDate: new Date(Date.now() - 7200000),
    source: 'Informed',
    category: 'Technology',
  },
];
