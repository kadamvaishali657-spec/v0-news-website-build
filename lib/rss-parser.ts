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
    // Try direct fetch first, then fall back to proxy
    let response: Response;
    
    try {
      // Attempt direct fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
        },
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      // Fall back to CORS proxy
      console.warn(`Direct fetch failed for ${feedUrl}, trying proxy...`);
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const url = corsProxy + encodeURIComponent(feedUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      response = await fetch(url, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch RSS feed from ${feedUrl}: ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      console.error(`Failed to parse RSS feed from ${feedUrl}`);
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
        console.error('Error parsing individual item:', error);
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error fetching/parsing RSS feed from ${feedUrl}:`, error);
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
];
