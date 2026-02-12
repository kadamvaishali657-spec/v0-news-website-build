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
}

// Parse RSS feed using JavaScript/XML parsing
export async function parseFeed(feedUrl: string, feedTitle: string): Promise<Article[]> {
  try {
    let text: string | null = null;
    let lastError: Error | null = null;

    // Try server-side proxy first (most reliable)
    try {
      const proxyResponse = await fetch(`/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        text = data.content;
        return await parseFeedContent(text, feedTitle);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[v0] Proxy fetch failed for ${feedTitle}, trying direct fetch...`);
    }

    // Fallback: Try direct fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        text = await response.text();
        return await parseFeedContent(text, feedTitle);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[v0] Direct fetch failed for ${feedTitle}, trying CORS proxy...`);
    }

    // Fallback: Try public CORS proxy
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        text = await response.text();
        return await parseFeedContent(text, feedTitle);
      }
    } catch (error) {
      lastError = error as Error;
    }

    console.error(`[v0] Failed to fetch RSS feed ${feedTitle}:`, lastError?.message || 'Unknown error');
    return [];
  } catch (error) {
    console.error(`[v0] Error in parseFeed for ${feedTitle}:`, error);
    return [];
  }
}

async function parseFeedContent(text: string, feedTitle: string): Promise<Article[]> {
  try {
    if (!text || typeof text !== 'string') {
      console.error(`[v0] Invalid feed content from ${feedTitle}`);
      return [];
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      console.error(`[v0] Failed to parse XML from ${feedTitle}`);
      return [];
    }

    const articles: Article[] = [];
    const items = xmlDoc.querySelectorAll('item');

    if (items.length === 0) {
      console.warn(`[v0] No items found in feed ${feedTitle}`);
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
        };

        articles.push(article);
      } catch (error) {
        console.warn(`[v0] Error parsing individual item from ${feedTitle}:`, error);
      }
    });

    console.log(`[v0] Successfully parsed ${articles.length} articles from ${feedTitle}`);
    return articles;
  } catch (error) {
    console.error(`[v0] Error parsing RSS feed content from ${feedTitle}:`, error);
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
      feeds.map(feed => parseFeed(feed.url, feed.title))
    );
    
    const allArticles = results.flat();
    
    // Sort by publication date, newest first
    allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    
    return allArticles;
  } catch (error) {
    console.error('Error fetching all feeds:', error);
    return [];
  }
}

export const DEFAULT_FEEDS: RSSFeed[] = [
  {
    url: 'https://feeds.feedburner.com/TechCrunch/',
    title: 'TechCrunch',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    title: 'NY Times Technology',
  },
  {
    url: 'https://www.theverge.com/rss/index.xml',
    title: 'The Verge',
  },
  {
    url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    title: 'Times of India',
  },
  {
    url: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    title: 'Google News India',
  },
];
