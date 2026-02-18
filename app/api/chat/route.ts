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

    // Build system prompt
    const systemPrompt = `You are a helpful news assistant chatbot for a news aggregator website called JustinNews.tech. 
Your role is to:
1. Answer questions about news articles and current events
2. Provide summaries of news stories
3. Help users search for specific topics or news
4. Recommend relevant articles based on user interests
5. Engage in general conversation about news and world events

Be conversational, friendly, and informative. Keep responses concise but helpful.
When discussing specific articles, be accurate and cite the article title and source.${articleContext}

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
      role: 'assistant',
      content: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
