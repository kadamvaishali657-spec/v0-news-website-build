import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, articles } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please set GROQ_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Build article context for the system prompt
    let articleContext = '';
    if (articles && Array.isArray(articles) && articles.length > 0) {
      articleContext = '\n\nCurrent articles available on the news feed:\n';
      articles.slice(0, 10).forEach((article: any, index: number) => {
        articleContext += `${index + 1}. "${article.title}" from ${article.source}\n   ${article.description.substring(0, 100)}...\n`;
      });
    }

    // Build system prompt with site section information
    const systemPrompt = `You are a helpful news assistant chatbot for a news aggregator website called JustinNews.tech. 

ABOUT JUSTINNEWS.TECH:
JustinNews.tech is a modern news aggregation platform with the following features and sections:

SITE SECTIONS & FEATURES:
1. HOME PAGE (/) - Main news feed with 25+ RSS sources across 8 categories (Global News, Tech, Business, Sports, Entertainment, Learning, Social Media, Random)
2. ARTICLE READER (/article) - Read full articles internally within the site with metadata, images, and sharing options
3. SAVED ARTICLES (/saved) - Bookmark and save articles for later reading
4. TRENDING (/trending) - View the 24 most recent and trending articles
5. ADVANCED SEARCH (/search) - Search articles by keyword, category, and date range
6. PUBLISH ARTICLES (/publish) - User-generated content - submit your own articles to the platform (articles appear in main feed)
7. NEWSLETTER (/newsletter) - Subscribe to daily, weekly, or monthly news digests by topic
8. SETTINGS (/settings) - Customize theme (dark/light mode), notifications, sharing preferences, and view usage analytics
9. ADMIN PANEL (/admin) - Manage RSS feeds, add custom news sources
10. SUPPORT (/support) - Contact page and FAQs with support email: workwithme785@gmail.com
11. NEWS CHATBOT (this) - AI-powered assistant to discuss news and answer questions about the site

USER ENGAGEMENT FEATURES:
- Save/bookmark articles for later reading
- Share articles to Twitter, LinkedIn, WhatsApp, or copy link
- Real-time search across all content
- Category filtering and trending articles
- User-generated article publishing
- Newsletter subscriptions with topic selection
- Analytics dashboard to track your reading habits
- Dark/Light theme preference
- Notification and sharing customization

PUBLISHING & CONTENT:
- Users can publish their own articles via /publish page
- Articles are stored and immediately appear on the home feed
- Published articles are searchable and shareable just like RSS feed articles
- Articles include author information and metadata

Your role is to:
1. Answer questions about news articles and current events
2. Answer questions about site features and how to use them
3. Provide summaries of news stories
4. Help users search for specific topics or news
5. Guide users through site features (publishing, newsletter, settings, etc.)
6. Recommend relevant articles based on user interests
7. Engage in general conversation about news, world events, and the platform

Be conversational, friendly, helpful, and informative. Keep responses concise but thorough.
When discussing specific articles, be accurate and cite the article title and source.
When answering questions about site features, be clear and direct with instructions.${articleContext}

Current time: ${new Date().toLocaleString()}`;

    // Prepare messages for Groq API
    const groqMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call Groq API directly
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      console.error('Groq API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response from Groq' },
        { status: groqResponse.status }
      );
    }

    const groqData = await groqResponse.json();
    const assistantMessage = groqData.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
