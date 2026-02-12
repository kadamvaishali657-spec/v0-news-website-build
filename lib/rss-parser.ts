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
    console.log(`[v0] Fetching feed: ${feedTitle} from ${feedUrl}`);
    let text: string | null = null;
    let lastError: Error | null = null;

    // Strategy 1: Try server-side proxy first
    try {
      console.log(`[v0] Attempting server-side proxy for ${feedTitle}`);
      const proxyResponse = await fetch(`/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        if (data.content) {
          console.log(`[v0] Server proxy succeeded for ${feedTitle}`);
          text = data.content;
          return await parseFeedContent(text, feedTitle);
        }
      } else {
        console.warn(`[v0] Server proxy returned status ${proxyResponse.status} for ${feedTitle}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[v0] Server proxy fetch failed for ${feedTitle}: ${lastError.message}`);
    }

    // Strategy 2: Try direct fetch with shorter timeout
    try {
      console.log(`[v0] Attempting direct fetch for ${feedTitle}`);
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
        console.log(`[v0] Direct fetch succeeded for ${feedTitle}`);
        text = await response.text();
        return await parseFeedContent(text, feedTitle);
      } else {
        console.warn(`[v0] Direct fetch returned status ${response.status} for ${feedTitle}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[v0] Direct fetch failed for ${feedTitle}: ${lastError.message}`);
    }

    // Strategy 3: Try allorigins CORS proxy (simpler alternative)
    try {
      console.log(`[v0] Attempting allorigins CORS proxy for ${feedTitle}`);
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`[v0] allorigins proxy succeeded for ${feedTitle}`);
        text = await response.text();
        return await parseFeedContent(text, feedTitle);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[v0] allorigins proxy failed for ${feedTitle}: ${lastError.message}`);
    }

    // All strategies failed
    console.error(`[v0] All fetch strategies failed for ${feedTitle}: ${lastError?.message}`);
    return [];
  } catch (error) {
    console.error(`[v0] Unexpected error in parseFeed for ${feedTitle}:`, error);
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
