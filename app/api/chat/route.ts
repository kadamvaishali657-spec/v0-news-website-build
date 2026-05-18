import { NextRequest, NextResponse } from 'next/server';
import { chatRateLimiter, getRateLimitId, rateLimitHeaders } from '@/lib/server/rate-limiter';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Chat API Handler
 * - Validates Groq API key is configured
 * - Builds context from current news articles
 * - Sends request to Groq LLM API
 * - Returns formatted response
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitId(request);
  const rateCheck = chatRateLimiter.check(clientId);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many chat requests. Please wait a moment.' },
      { status: 429, headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs) }
    );
  }

  try {
    // [1] PARSE REQUEST BODY
    let requestBody: any;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages, articles } = requestBody;

    // [2] VALIDATE MESSAGES
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400 }
      );
    }

    // [3] VALIDATE MESSAGE FORMAT
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: 'Each message must have role and content' },
          { status: 400 }
        );
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        return NextResponse.json(
          { error: 'Message role must be "user" or "assistant"' },
          { status: 400 }
        );
      }
    }

    // [4] CHECK ENVIRONMENT VARIABLE
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      console.error('[v0-chat] GROQ_API_KEY environment variable not set');
      return NextResponse.json(
        { error: 'AI chatbot is not configured. Please set GROQ_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    // [5] BUILD ARTICLE CONTEXT
    let articleContext = '';
    if (articles && Array.isArray(articles) && articles.length > 0) {
      try {
articleContext = '\n\nCurrent articles available on the news feed:\n';
        articles.slice(0, 10).forEach((article: any, index: number) => {
          const title = article.title || 'Untitled';
          const source = article.source || 'Unknown Source';
          const desc = (article.description || '').substring(0, 100);
          articleContext += `${index + 1}. "${title}" from ${source}\n`;
          if (desc) articleContext += `   ${desc}...\n`;
        });
      } catch (e) {
        console.warn('[v0-chat] Error building article context:', e);
        // Continue without article context if it fails
      }
    }
    // [6] BUILD SYSTEM PROMPT
    const systemPrompt = `You are INFORMED Assistant - a highly knowledgeable and professional news assistant chatbot for the INFORMED news aggregator.
Your responsibilities:
1. Answer questions about news, current events, and world affairs accurately and objectively.
2. Provide concise and clear summaries of news stories in simple terms.
3. Help users search for specific topics, news stories, or articles.
4. Recommend relevant articles based on user interests.
5. Provide context and background on major news events.
6. Engage in helpful, professional, and friendly conversation about news and world events.
Available articles:${articleContext}
Guidelines:
- Keep responses concise but comprehensive (2-3 sentences for quick questions, up to 1 paragraph for detailed requests).
- Be accurate, objective, and avoid speculation.
- If you don't know the answer, say so honestly.
- Always cite article titles and sources when referencing specific stories.
- Current time: ${new Date().toLocaleString()}`;
    // [7] PREPARE MESSAGES
    const groqMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content.trim(),
      })),
    ];

    // [8] CALL GROQ API
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
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    // [9] HANDLE GROQ RESPONSE
    if (!groqResponse.ok) {
      let errorDetail = 'Unknown error';
      try {
        const errorData = await groqResponse.json();
        errorDetail = errorData.error?.message || errorData.error || JSON.stringify(errorData);
      } catch {
        errorDetail = await groqResponse.text();
      }
      
      console.error('[v0-chat] Groq API error:', {
        status: groqResponse.status,
        detail: errorDetail,
      });

      // Map Groq errors to user-friendly messages
      if (groqResponse.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed with AI service' },
          { status: 503 }
        );
      } else if (groqResponse.status === 429) {
        return NextResponse.json(
          { error: 'AI service rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      } else if (groqResponse.status === 503) {
        return NextResponse.json(
          { error: 'AI service is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      } else {
        return NextResponse.json(
          { error: `AI service returned error: ${groqResponse.status}` },
          { status: groqResponse.status }
        );
      }
    }

    // [10] PARSE RESPONSE
    let groqData;
    try {
      groqData = await groqResponse.json();
    } catch {
      console.error('[v0-chat] Failed to parse Groq response');
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // [11] EXTRACT MESSAGE
    const assistantMessage = groqData.choices?.[0]?.message?.content?.trim();
    
    if (!assistantMessage) {
      console.error('[v0-chat] Empty response from Groq', groqData);
      return NextResponse.json(
        { error: 'AI service returned empty response' },
        { status: 500 }
      );
    }

    // [12] RETURN SUCCESS
    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    // [13] HANDLE UNEXPECTED ERRORS
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[v0-chat] Request timeout');
        return NextResponse.json(
          { error: 'Request to AI service timed out' },
          { status: 504 }
        );
      }
      console.error('[v0-chat] Error:', error.message);
    } else {
      console.error('[v0-chat] Unknown error:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
