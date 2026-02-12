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
    let response: Response | null = null;
    let lastError: Error | null = null;

    // List of CORS proxies to try in order
    const proxies = [
      (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
      (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
    ];

    // Try direct fetch first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await parseFeedContent(await response.text(), feedTitle);
      }
    } catch (error) {
      lastError = error as Error;
    }

    // Try CORS proxies
    for (const proxyFn of proxies) {
      try {
        const proxyUrl = proxyFn(feedUrl);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        response = await fetch(proxyUrl, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return await parseFeedContent(await response.text(), feedTitle);
        }
      } catch (error) {
        lastError = error as Error;
        continue;
      }
    }

    console.error(`Failed to fetch RSS feed from ${feedUrl}:`, lastError?.message || 'Unknown error');
    return [];
  } catch (error) {
    console.error(`Error fetching RSS feed from ${feedUrl}:`, error);
    return [];
  }
}

async function parseFeedContent(text: string, feedTitle: string): Promise<Article[]> {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      console.error(`Failed to parse RSS feed from ${feedTitle}`);
      return [];
    }

    const articles: Article[] = [];
    const items = xmlDoc.querySelectorAll('item');

    items.forEach((item, index) => {
      try {
        const title = item.querySelector('title')?.textContent || 'No title';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDateStr = item.querySelector('pubDate')?.textContent || new Date().toISOString();

        // Extract image from various possible locations in RSS
        let image: string | undefined;

        // Try to find image in different RSS formats
        const mediaContent = item.querySelector('media\\:content, [url]');
        if (mediaContent && mediaContent.getAttribute('url')) {
          image = mediaContent.getAttribute('url') || undefined;
        }

        const mediaThumb = item.querySelector('media\\:thumbnail');
        if (!image && mediaThumb && mediaThumb.getAttribute('url')) {
          image = mediaThumb.getAttribute('url') || undefined;
        }

        // Try enclosure
        const enclosure = item.querySelector('enclosure');
        if (!image && enclosure && enclosure.getAttribute('url')) {
          const encUrl = enclosure.getAttribute('url');
          if (encUrl && (encUrl.includes('.jpg') || encUrl.includes('.png') || encUrl.includes('.gif'))) {
            image = encUrl;
          }
        }

        // Try content:encoded or description for image tags
        if (!image) {
          const content = item.querySelector('content\\:encoded')?.textContent || '';
          const descWithContent = (description + content);
          const imgMatch = descWithContent.match(/<img[^>]+src=["']([^"']+)["']/);
          if (imgMatch && imgMatch[1]) {
            image = imgMatch[1];
          }
        }

        const article: Article = {
          id: `${feedTitle}-${index}-${Date.now()}`,
          title: cleanText(title),
          description: cleanText(description.substring(0, 200)),
          link,
          pubDate: new Date(pubDateStr),
          image,
          source: feedTitle,
        };

        articles.push(article);
      } catch (error) {
        // Silently skip individual items that fail to parse
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed content from ${feedTitle}:`, error);
    return [];
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
