

## Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx              # Homepage with news feed
│   ├── admin/page.tsx        # Admin dashboard
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and theme
├── components/
│   ├── header.tsx            # Top navigation bar
│   ├── news-card.tsx         # Individual news card component
│   ├── search-bar.tsx        # Search functionality
│   ├── category-filter.tsx   # Category filter buttons
│   ├── pagination.tsx        # Pagination controls
│   └── auto-refresh.tsx      # Auto-refresh mechanism
├── lib/
│   ├── rss-parser.ts         # RSS feed parsing logic
│   ├── error-handling.ts     # Error handling utilities
│   └── utils.ts              # Utility functions
```

## Usage

### Homepage Features

- **Latest News**: Displays all articles from configured RSS feeds
- **Featured Stories**: Top 5 most recent articles at the top
- **Search**: Real-time search across article titles and descriptions
- **Category Filter**: Filter articles by category (All, AI, Gadgets, Startups, Cybersecurity)
- **Pagination**: Navigate through pages of articles (12 per page)
- **Read More**: Click to open original article in new tab

### Admin Dashboard

Access at `/admin` to:
- **Add Feed**: Enter RSS feed URL and title
- **Remove Feed**: Delete custom feeds
- **Reset to Default**: Restore original feeds
- **View Current Feeds**: See all configured feeds

#### To Add a Custom RSS Feed:
1. Navigate to `/admin`
2. Enter the RSS feed URL (must be valid XML RSS format)
3. Enter a title for the feed
4. Click "Add Feed"
5. The page will refresh and load articles from the new feed

#### Recommended RSS Feed URLs:
- TechCrunch: `https://feeds.feedburner.com/TechCrunch/`
- The Verge: `https://www.theverge.com/rss/index.xml`
- NY Times Tech: `https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`
- Hacker News: `https://news.ycombinator.com/rss`
- Wired: `https://www.wired.com/feed/rss`
- Ars Technica: `https://arstechnica.com/feed/`

## Technical Details

### RSS Feed Parsing

The application uses JavaScript's built-in `DOMParser` to parse RSS XML feeds. It extracts:
- Article title
- Description/content
- Publication date
- Source URL
- Article image (from multiple possible locations)

### CORS Handling

CORS (Cross-Origin Resource Sharing) restrictions may prevent direct access to some RSS feeds. The application handles this by:
1. First attempting a direct fetch
2. Falling back to proxy services if blocked:
   - `api.allorigins.win`
   - `cors-anywhere.herokuapp.com`

### Data Storage

- **Browser Storage**: Uses `localStorage` to store custom RSS feed URLs
- **No Backend Required**: All processing happens in the browser
- **Persistent Storage**: Feeds are saved even after closing the browser

### Performance Optimizations

- Lazy loading for images
- Debounced search (300ms delay)
- Efficient DOM updates
- Image caching
- Responsive images with Next.js Image component

## Customization

### Change Dark Theme Colors

Edit `/app/globals.css` to modify the color scheme:
```css
--background: 12 15% 3%;      /* Dark navy background */
--foreground: 0 0% 98%;        /* Light text */
--accent: 42 94% 56%;          /* Amber accent color */
```

### Modify Featured Articles Count

In `/app/page.tsx`, change:
```javascript
const featuredArticles = articles.slice(0, 5); // Change 5 to desired number
```

### Adjust Pagination Size

In `/app/page.tsx`, change:
```javascript
const ARTICLES_PER_PAGE = 12; // Change to your preference
```

## SEO Features

- Dynamic meta tags with Open Graph support
- Twitter card metadata
- Semantic HTML structure
- Schema.org compatibility
- Mobile-friendly viewport settings
- Descriptive page titles and descriptions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **CORS Restrictions**: Some RSS feeds may not be accessible due to CORS policies
2. **Feed Availability**: Feeds must be publicly accessible
3. **Image Hosting**: Images must be accessible from their original URLs
4. **Data Persistence**: Uses browser localStorage (clears on data cleanup)
5. **Rate Limiting**: Some proxy services may rate limit requests

## Troubleshooting

### No articles showing up?
- Check if RSS feeds are valid by visiting them in a browser
- Try adding a different feed URL
- Check browser console for error messages
- Clear browser cache and reload

### Images not loading?
- Some feeds may host images on restricted domains
- Check browser console for CORS errors
- Try accessing the image URL directly in your browser

### Feed taking too long to load?
- Some feeds may respond slowly
- Try removing slower feeds from the admin dashboard
- Check your internet connection

### Error: "CORS restrictions prevent accessing this feed"
- The RSS provider may not allow cross-origin access
- Try using an alternative feed source
- Some providers require specific headers that the proxy service might not support

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

### Environment Requirements

- Node.js 18+
- No backend server required
- No database required
- No API keys needed (uses free RSS feeds)

## Performance Tips

1. Remove unused RSS feeds to reduce loading time
2. Use feeds that have frequent updates
3. Clear browser cache periodically
4. Consider using a CDN for image delivery
5. Monitor localStorage usage on slower devices

## Future Enhancements

- Podcast feed support
- YouTube channel integration
- Newsletter subscription
- Dark/light mode toggle
- Reading time estimates
- Share to social media
- Bookmarking functionality
- Advanced filtering and search
- Multi-language support
- Push notifications for breaking news

## License

Open source - feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the browser console for error messages
3. Verify RSS feed URLs are valid
4. Try the default feeds first

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
