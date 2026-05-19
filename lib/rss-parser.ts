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

async function parseFeedContent(text: string | null, feedTitle: string, category?: string): Promise<Article[]> {
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
        let link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDateStr = item.querySelector('pubDate')?.textContent || new Date().toISOString();

        // Validate and normalize link
        link = link.trim();
        
        // Skip if link is missing, empty, or invalid
        if (!link || !title.trim()) {
          return; // Skip items without essential data
        }

        // Validate URL format
        try {
          new URL(link);
        } catch {
          console.log('[v0] Invalid URL skipped:', link);
          return; // Skip items with invalid URLs
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
          link: link, // Already validated above
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
  
  // India-specific
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', title: 'Times of India', category: 'Global News' },
  { url: 'https://www.thehindu.com/news/?service=rss', title: 'The Hindu', category: 'Global News' },
];

// Fallback sample data for development/testing when feeds are unavailable
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'fallback-1',
    title: 'Artificial Intelligence Breakthroughs Reshape Technology Industry in 2026',
    description: 'Latest developments in AI technology continue to transform how companies approach product development and customer service.',
    link: 'https://techcrunch.com/2026/02/11/ai-breakthroughs/',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'TechCrunch',
    category: 'Tech & Innovation',
  },
  {
    id: 'fallback-2',
    title: 'Global Tech Stocks Rally on Strong Quarterly Earnings Reports',
    description: 'Major technology companies report better-than-expected earnings, driving investor confidence across the sector.',
    link: 'https://www.nytimes.com/2026/02/11/business/tech-stocks-earnings.html',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'NY Times Technology',
    category: 'Business & Finance',
  },
  {
    id: 'fallback-3',
    title: 'New Smartphone Features Focus on Battery Life and Sustainability',
    description: 'Manufacturers prioritize environmental concerns as consumers demand longer-lasting devices with reduced carbon footprint.',
    link: 'https://www.theverge.com/2026/2/11/smartphone-battery-sustainability',
    pubDate: new Date('2026-02-11'),
    image: undefined,
    source: 'The Verge',
    category: 'Tech & Innovation',
  },
  {
    id: 'fallback-4',
    title: 'Renewable Energy Production Reaches New Records Globally',
    description: 'Clean energy initiatives across continents show unprecedented growth, signaling shift toward sustainable power systems.',
    link: 'https://www.bbc.com/news/science_and_environment',
    pubDate: new Date('2026-02-10'),
    image: undefined,
    source: 'BBC News',
    category: 'Environment',
  },
  {
    id: 'fallback-5',
    title: 'Major Science Discovery in Medical Research Could Transform Treatment Options',
    description: 'Researchers announce breakthrough findings that could revolutionize how doctors treat chronic diseases.',
    link: 'https://www.sciencedaily.com',
    pubDate: new Date('2026-02-10'),
    image: undefined,
    source: 'Science Daily',
    category: 'Science & Health',
  },
];
