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

// Parse RSS feed using JavaScript/XML parsing
export async function parseFeed(feedUrl: string, feedTitle: string, category?: string): Promise<Article[]> {
  try {
    let text: string | null = null;
    let lastError: Error | null = null;

    // Strategy 1: Try server-side proxy first
    try {
      const proxyResponse = await fetch(`/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        if (data.content) {
          text = data.content;
          return await parseFeedContent(text, feedTitle, category);
        }
      }
    } catch (error) {
      lastError = error as Error;
    }

    // Strategy 2: Try direct fetch with shorter timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        text = await response.text();
        return await parseFeedContent(text, feedTitle, category);
      }
    } catch (error) {
      lastError = error as Error;
    }

    // Strategy 3: Try allorigins CORS proxy (simpler alternative)
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        text = await response.text();
        return await parseFeedContent(text, feedTitle, category);
      }
    } catch (error) {
      lastError = error as Error;
    }

    // All strategies failed
    return [];
  } catch (error) {
    return [];
  }
}

async function parseFeedContent(text: string, feedTitle: string, category?: string): Promise<Article[]> {
  try {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      return [];
    }

    const articles: Article[] = [];
    const items = xmlDoc.querySelectorAll('item');

    if (items.length === 0) {
      return [];
    }

    items.forEach((item, index) => {
      try {
        const title = item.querySelector('title')?.textContent || 'No title';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDateStr = item.querySelector('pubDate')?.textContent || new Date().toISOString();

        if (!link || !title.trim()) {
          return; // Skip items without essential data
        }

        // Extract image from various possible locations in RSS
        let image: string | undefined;

        // Try to find image in different RSS formats
        const mediaContent = item.querySelector('[url]');
        if (mediaContent && mediaContent.getAttribute('url')) {
          image = mediaContent.getAttribute('url') || undefined;
        }

        const mediaThumb = item.querySelector('media\\:thumbnail, thumbnail');
        if (!image && mediaThumb && mediaThumb.getAttribute('url')) {
          image = mediaThumb.getAttribute('url') || undefined;
        }

        // Try enclosure
        const enclosure = item.querySelector('enclosure');
        if (!image && enclosure && enclosure.getAttribute('url')) {
          const encUrl = enclosure.getAttribute('url');
          if (encUrl && (encUrl.includes('.jpg') || encUrl.includes('.png') || encUrl.includes('.gif') || encUrl.includes('.jpeg'))) {
            image = encUrl;
          }
        }

        // Try content:encoded or description for image tags
        if (!image) {
          const content = item.querySelector('content\\:encoded')?.textContent || '';
          const descWithContent = (description + content);
          const imgMatch = descWithContent.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1]) {
            image = imgMatch[1];
          }
        }

        const article: Article = {
          id: `${feedTitle}-${index}-${Date.now()}-${Math.random()}`,
          title: cleanText(title).substring(0, 200),
          description: cleanText(description).substring(0, 250),
          link: link.trim(),
          pubDate: new Date(pubDateStr),
          image: image && image.trim().length > 0 ? image.trim() : undefined,
          source: feedTitle,
          category: category,
        };

        articles.push(article);
      } catch (error) {
        // Silently skip malformed items
      }
    });

    return articles;
  } catch (error) {
    return [];
  }
}

function cleanText(text: string): string {
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  const txt = document.createElement('textarea');
  txt.innerHTML = clean;
  return txt.value;
}

export async function fetchAllFeeds(feeds: RSSFeed[]): Promise<Article[]> {
  try {
    const results = await Promise.all(
      feeds.map(feed => parseFeed(feed.url, feed.title, feed.category))
    );
    
    const allArticles = results.flat();
    
    // If no articles fetched, use fallback data
    if (allArticles.length === 0) {
      return FALLBACK_ARTICLES;
    }
    
    // Separate India news from other articles
    const indiaNewsSources = ['Times of India', 'Google News India'];
    const indiaArticles = allArticles.filter(article => 
      indiaNewsSources.includes(article.source)
    );
    const otherArticles = allArticles.filter(article => 
      !indiaNewsSources.includes(article.source)
    );
    
    // Sort each group by publication date, newest first
    indiaArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    otherArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    
    // Return India news first, then other articles
    return [...indiaArticles, ...otherArticles];
  } catch (error) {
    // Return fallback on error
    return FALLBACK_ARTICLES;
  }
}

export const DEFAULT_FEEDS: RSSFeed[] = [
  // Top News RSS Feeds - Premium Global Sources
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', title: 'New York Times Home', category: 'Global News' },
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC News World', category: 'Global News' },
  { url: 'https://feeds.reuters.com/reuters/topNews', title: 'Reuters Top News', category: 'Global News' },
  { url: 'https://www.theguardian.com/world/rss', title: 'The Guardian World', category: 'Global News' },
  { url: 'https://feeds.npr.org/1001/rss.xml', title: 'NPR News', category: 'Global News' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World News', category: 'Global News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', title: 'Al Jazeera English', category: 'Global News' },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', title: 'Bloomberg News', category: 'Global News' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', title: 'NY Times World', category: 'Global News' },
  { url: 'https://feeds.theguardian.com/theguardian/world/rss', title: 'The Guardian World', category: 'Global News' },
  
  // Technology RSS Feeds
  { url: 'https://techcrunch.com/feed/', title: 'TechCrunch', category: 'Tech & Innovation' },
  { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', category: 'Tech & Innovation' },
  { url: 'https://www.wired.com/feed/rss', title: 'WIRED', category: 'Tech & Innovation' },
  { url: 'http://feeds.arstechnica.com/arstechnica/index', title: 'Ars Technica', category: 'Tech & Innovation' },
  { url: 'https://venturebeat.com/feed/', title: 'VentureBeat', category: 'Tech & Innovation' },
  { url: 'https://news.ycombinator.com/rss', title: 'Hacker News', category: 'Tech & Innovation' },
  { url: 'https://www.engadget.com/rss.xml', title: 'Engadget', category: 'Tech & Innovation' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', title: 'Ars Technica', category: 'Tech & Innovation' },
  { url: 'http://feeds.feedburner.com/TechCrunch/', title: 'TechCrunch (Secondary)', category: 'Tech & Innovation' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', title: 'NY Times Technology', category: 'Tech & Innovation' },
  
  // Business & Startups
  { url: 'https://feeds.bloomberg.com/markets/news.rss', title: 'Bloomberg Markets', category: 'Business & Finance' },
  { url: 'https://www.entrepreneur.com/latest.rss', title: 'Entrepreneur', category: 'Business & Finance' },
  { url: 'https://www.fastcompany.com/rss', title: 'Fast Company', category: 'Business & Finance' },
  { url: 'https://www.forbes.com/feed/', title: 'Forbes', category: 'Business & Finance' },
  { url: 'https://feeds.ft.com/home/rss', title: 'Financial Times', category: 'Business & Finance' },
  { url: 'https://feeds.bloomberg.com/technology/news.rss', title: 'Bloomberg Tech', category: 'Business & Finance' },
  { url: 'https://feeds.bloomberg.com/markets/sentiment.rss', title: 'Bloomberg Markets', category: 'Business & Finance' },
  
  // Blogs & Learning - Influential Personal Blogs
  { url: 'https://seths.blog/feed', title: 'Seth Godin\'s Blog', category: 'Learning & Education' },
  { url: 'https://tim.blog/feed/', title: 'Tim Ferriss Blog', category: 'Learning & Education' },
  { url: 'https://problogger.com/blog/feed/', title: 'ProBlogger', category: 'Learning & Education' },
  { url: 'https://feeds.feedburner.com/tedtalks_video', title: 'TED Talks', category: 'Learning & Education' },
  { url: 'https://www.khanacademy.org/about/blog/rss.xml', title: 'Khan Academy Blog', category: 'Learning & Education' },
  { url: 'https://www.edx.org/blog/feed', title: 'edX Blog', category: 'Learning & Education' },
  
  // Mixed / General Feeds
  { url: 'https://hnrss.org/frontpage', title: 'Hacker News (Official RSS)', category: 'Tech & Innovation' },
  { url: 'https://www.reddit.com/r/technology/.rss', title: 'Reddit r/technology', category: 'Tech & Innovation' },
  { url: 'https://www.reddit.com/r/worldnews/.rss', title: 'Reddit r/worldnews', category: 'Global News' },
  { url: 'https://www.reddit.com/r/sports/.rss', title: 'Reddit r/sports', category: 'Sports' },
  
  // Science & Health
  { url: 'https://feeds.nature.com/nature/rss/current', title: 'Nature', category: 'Science & Health' },
  { url: 'https://feeds.sciencedaily.com/sciencedaily.rss', title: 'Science Daily', category: 'Science & Health' },
  { url: 'https://www.medicalnewstoday.com/rss.xml', title: 'Medical News Today', category: 'Science & Health' },
  
  // Sports
  { url: 'https://www.espn.com/espn/rss/news', title: 'ESPN Top Headlines', category: 'Sports' },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', title: 'BBC Sport', category: 'Sports' },
  
  // Entertainment & Culture
  { url: 'https://www.rollingstone.com/feed/', title: 'Rolling Stone', category: 'Entertainment & Culture' },
  { url: 'https://variety.com/feed/', title: 'Variety', category: 'Entertainment & Culture' },
  { url: 'https://feeds.theguardian.com/theguardian/film/rss', title: 'The Guardian Film', category: 'Entertainment & Culture' },
  { url: 'https://www.hollywoodreporter.com/feed/rss.xml', title: 'Hollywood Reporter', category: 'Entertainment & Culture' },
  
  // Lifestyle & Wellness
  { url: 'https://www.boredpanda.com/feed/', title: 'Bored Panda', category: 'Lifestyle & Wellness' },
  { url: 'https://www.mentalfloss.com/rss.xml', title: 'Mental Floss', category: 'Lifestyle & Wellness' },
  { url: 'https://www.reddit.com/r/lifeprotips/.rss', title: 'Reddit r/lifeprotips', category: 'Lifestyle & Wellness' },
  
  // Politics & Government
  { url: 'https://feeds.theguardian.com/theguardian/politics/rss', title: 'The Guardian Politics', category: 'Politics & Government' },
  { url: 'https://feeds.politico.com/playbook.rss', title: 'Politico Playbook', category: 'Politics & Government' },
  
  // Environment & Sustainability
  { url: 'https://feeds.theguardian.com/theguardian/environment/rss', title: 'The Guardian Environment', category: 'Environment' },
  { url: 'https://www.mongabay.com/feed/', title: 'Mongabay', category: 'Environment' },
  
  // India-specific
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', title: 'Times of India', category: 'Global News' },
  { url: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en', title: 'Google News India', category: 'Global News' },
  { url: 'https://www.thehindu.com/news/?service=rss', title: 'The Hindu', category: 'Global News' },
];

// Fallback sample data for development/testing when feeds are unavailable
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'fallback-1',
    title: 'Artificial Intelligence Breakthroughs Reshape Technology Industry in 2026',
    description: 'Latest developments in AI technology continue to transform how companies approach product development and customer service.',
    link: 'https://example.com',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'TechCrunch',
  },
  {
    id: 'fallback-2',
    title: 'Global Tech Stocks Rally on Strong Quarterly Earnings Reports',
    description: 'Major technology companies report better-than-expected earnings, driving investor confidence across the sector.',
    link: 'https://example.com',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'NY Times Technology',
  },
  {
    id: 'fallback-3',
    title: 'New Smartphone Features Focus on Battery Life and Sustainability',
    description: 'Manufacturers prioritize environmental concerns as consumers demand longer-lasting devices with reduced carbon footprint.',
    link: 'https://example.com',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'The Verge',
  },
];
