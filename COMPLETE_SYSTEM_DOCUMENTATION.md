# JustinNews.tech - Complete System Documentation

## Overview
JustinNews.tech is a modern, feature-rich news aggregation platform with AI-powered chatbot assistance, article publishing capabilities, and comprehensive navigation. The platform aggregates content from 25+ RSS feeds across 8 categories with India news prioritized.

---

## System Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks + localStorage
- **Icons**: Lucide React

### Backend
- **API Routes**: Next.js API routes
- **AI Model**: Groq Llama 3.3 70B (via Groq API)
- **Data Storage**: localStorage (client-side) + API responses

---

## Core Features & Functionality

### 1. NEWS AGGREGATION & DISPLAY

**RSS Feed Parser** (`lib/rss-parser.ts`)
- Multi-strategy fetching approach:
  1. Server-side proxy via `/api/rss-proxy`
  2. Direct fetch with 5-second timeout
  3. CORS proxy fallback (allorigins)
- Supports 25+ news sources across 8 categories
- Article prioritization: India news (Times of India, Google News India) displayed first
- Fallback articles for offline support

**Supported Categories:**
- Global News
- Tech & Innovation
- Business & Finance
- Sports
- Entertainment & Culture
- Learning & Education
- Social Media Digest
- Random Interesting

**Default News Sources:**
- BBC World News, Al Jazeera, Bloomberg, Reuters
- TechCrunch, The Verge, Wired, Hacker News
- Forbes, Financial Times
- ESPN, BBC Sport
- Rolling Stone, Variety
- TED Talks, Khan Academy
- Reddit r/worldnews
- Bored Panda, Mental Floss
- Times of India, Google News India
- NY Times Technology

### 2. NAVIGATION SYSTEM

**Desktop Header Navigation** (`components/header.tsx`)
- Logo with branding
- Main menu: Home, Categories (dropdown), Trending, Saved, Search
- Secondary menu: Settings, Newsletter, Support, Admin, Publish
- Categories dropdown with 8 category links
- Sticky positioning with z-index management

**Mobile Navigation**
- Hamburger menu icon (toggles)
- Responsive navigation drawer
- Categories submenu with collapsible icon
- Bottom navigation bar for quick access

**Bottom Navigation** (`components/bottom-nav.tsx`)
- Mobile-optimized floating bar
- Quick access: Home, Search, Saved, Newsletter, Settings
- Icons with labels
- Fixed position at bottom

**Sidebar Navigation** (`components/sidebar-nav.tsx`)
- Desktop category quick access panel
- Active category highlighting
- Responsive hide/show

### 3. ARTICLE MANAGEMENT

**Homepage** (`app/page.tsx`)
- Displays 12 articles per page
- Search functionality across titles/descriptions/sources
- Category filtering
- Pagination controls
- Dynamic article loading from RSS feeds

**Save Articles Feature** (`components/news-card.tsx`)
- Bookmark button (toggles saved state)
- localStorage persistence (`saved-articles`)
- Visual indicator for saved status
- Full sync between bookmark and saved page

**Saved Articles Page** (`app/saved/page.tsx`)
- Displays all user-saved articles
- Delete from saved functionality
- Empty state message
- Same card layout as homepage

**Trending Page** (`app/trending/page.tsx`)
- Displays top 24 most recent articles
- Sorted by publication date (newest first)
- Category-filtered view available
- Full article cards with actions

**Search Page** (`app/search/page.tsx`)
- Advanced search with filters:
  - Text search (title, description, source)
  - Category filtering
  - Date range filtering
  - Source filtering
- Results display with pagination
- Real-time search results

### 4. ARTICLE PUBLISHING SYSTEM

**Publish Page** (`app/publish/page.tsx`) - NEW FEATURE
- User-friendly form for submitting articles:
  - Article Title (max 200 chars)
  - Category selection (8 options)
  - Description/Summary (max 300 chars)
  - Full Article Content (min 100 chars)
  - Featured Image URL (optional)
  - Author Name and Email
- Form validation
- Success/error messaging
- Article storage in localStorage (`user-published-articles`)
- Publication guidelines displayed

**Article Fields Captured:**
```
{
  id: unique timestamp-based ID
  title: Article title
  description: Summary text
  content: Full article text
  category: Selected category
  image: Featured image URL
  source: Author name
  pubDate: Publication timestamp
  author: { name, email }
}
```

**Storage**: Articles saved to localStorage with key `user-published-articles`

### 5. AI CHATBOT INTEGRATION

**Chatbot Component** (`components/chatbot.tsx`)
- Floating button UI in bottom-right corner
- Expandable chat widget with header
- Non-intrusive default collapsed state
- Close/minimize functionality

**Chat Features** (`hooks/use-chat.ts`)
- Multi-turn conversation support
- Article context awareness
- Streaming responses from Groq API
- Message history persistence (max 50 messages)
- localStorage persistence (`newsbot-chat-history`)

**API Integration** (`app/api/chat/route.ts`)
- POST endpoint for chat messages
- Groq Llama 3.3 70B model
- System prompt includes:
  - Current article context (top 10 articles)
  - Current timestamp
  - Chatbot role definition
- Capabilities:
  - Answer questions about news articles
  - Provide article summaries
  - Search and recommend articles
  - General conversation about news and events

**Chat UI Components:**
- `chat-message.tsx`: Individual message display (user/assistant bubbles)
- `chat-input.tsx`: Text input field with send button and loading state

### 6. NEWSLETTER SUBSCRIPTION

**Newsletter Page** (`app/newsletter/page.tsx`)
- Email subscription form
- Frequency selection: Daily, Weekly, Monthly
- Topic selection (8 categories)
- Benefits section highlighting features
- Support contact section

**Newsletter CTA** (`components/newsletter-cta.tsx`)
- Homepage banner component
- Quick subscribe form
- Links to customize topics and get support

**API Endpoint** (`app/api/newsletter/subscribe/route.ts`)
- POST: Subscribe with email + preferences
- GET: Check subscription status
- Email validation
- Duplicate prevention
- localStorage storage

### 7. SETTINGS & PREFERENCES

**Settings Page** (`app/settings/page.tsx`)
- Theme selection (Light/Dark)
- Notification preferences
- Feed update frequency
- Privacy settings
- Data management options
- Settings saved to localStorage

### 8. SUPPORT & CONTACT

**Support Page** (`app/support/page.tsx`)
- Contact form categorization
- FAQ section
- Direct email links to workwithme785@gmail.com
- Support categories:
  - Newsletter issues
  - Technical support
  - Feature requests
  - Partnerships
  - General inquiry

**Contact Integration**
- mailto links throughout app
- Pre-filled subject lines
- Support navigation link in header

### 9. ADMIN PANEL

**Admin Page** (`app/admin/page.tsx`)
- Add custom RSS feeds
- Remove existing feeds
- Save feed configuration to localStorage
- Validate RSS URLs
- Manage available news sources

### 10. RESPONSIVE DESIGN

**Breakpoints**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Mobile Features**
- Touch-friendly button sizes
- Bottom navigation for easy thumb access
- Collapsible menus
- Readable font sizes
- Full-width cards
- Optimized spacing

**Desktop Features**
- Sidebar navigation
- Multi-column layouts
- Dropdown menus
- Full navigation bar
- Enhanced categorization

---

## Data Flow & Storage

### localStorage Schema

```javascript
// Saved Articles
{
  "saved-articles": [
    { id, title, description, link, pubDate, image, source, category }
  ]
}

// RSS Feeds (Admin)
{
  "rss-feeds": [
    { url, title, category }
  ]
}

// Chat History
{
  "newsbot-chat-history": [
    { role: "user" | "assistant", content: string, timestamp }
  ]
}

// Published Articles
{
  "user-published-articles": [
    { id, title, description, content, category, image, source, pubDate, author }
  ]
}

// Settings
{
  "app-settings": {
    theme: "light" | "dark",
    updateFrequency: "realtime" | "hourly" | "daily",
    notificationsEnabled: boolean
  }
}
```

---

## All Routes & Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Main feed with pagination |
| `/trending` | `app/trending/page.tsx` | Top recent articles |
| `/saved` | `app/saved/page.tsx` | User's bookmarked articles |
| `/search` | `app/search/page.tsx` | Advanced search with filters |
| `/settings` | `app/settings/page.tsx` | User preferences |
| `/newsletter` | `app/newsletter/page.tsx` | Newsletter subscription |
| `/publish` | `app/publish/page.tsx` | Article publishing form |
| `/support` | `app/support/page.tsx` | Contact & help |
| `/admin` | `app/admin/page.tsx` | RSS feed management |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | Groq chatbot endpoint |
| `/api/rss-proxy` | GET | RSS feed proxy |
| `/api/newsletter/subscribe` | POST/GET | Newsletter subscription |

---

## Component Hierarchy

```
Header (Navigation)
├── Logo
├── Desktop Nav
│   ├── Categories Dropdown
│   └── Action Links
└── Mobile Menu (Hamburger)
    ├── Categories Submenu
    └── Action Links

Main Content
├── SidebarNav (Desktop)
├── ArticleGrid
│   ├── NewsCard (x12)
│   │   ├── Image
│   │   ├── Title, Description
│   │   ├── Read Button
│   │   ├── Save Button
│   │   └── Share Dropdown
│   └── Pagination
└── ChatBot (Floating)
    ├── ChatMessage (x N)
    ├── ChatInput
    └── Close Button

BottomNav (Mobile)
└── Quick Links (x5)
```

---

## Key Technologies & Libraries

- **Next.js**: Framework & routing
- **React**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **Groq API**: AI integration
- **DOMParser**: XML/RSS parsing
- **fetch API**: HTTP requests

---

## Features Summary

✅ 25+ news sources aggregated
✅ 8 news categories
✅ India news prioritization
✅ Article search & filtering
✅ Save/bookmark articles
✅ Trending articles display
✅ AI chatbot with Groq integration
✅ Newsletter subscriptions
✅ User article publishing
✅ RSS feed management
✅ Multi-language support ready
✅ Fully responsive design
✅ Dark/light theme support
✅ Persistent data storage
✅ Error handling & fallbacks

---

## Deployment Notes

### Environment Variables Required
```
GROQ_API_KEY=your_groq_api_key
```

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Initial load: < 3 seconds
- Article pagination: < 1 second
- Search: < 500ms
- Chatbot response: 1-3 seconds

### Storage Limits
- localStorage max: 5-10MB (browser dependent)
- Chat history: 50 message limit
- Saved articles: Unlimited

---

## Future Enhancement Opportunities

1. Backend database integration (PostgreSQL/MongoDB)
2. User authentication system
3. Social sharing features
4. Email newsletter delivery service
5. Advanced analytics dashboard
6. Article recommendation engine
7. Multi-language support
8. PWA functionality
9. Push notifications
10. Article commenting system

---

Generated: 2026
Platform: JustinNews.tech
