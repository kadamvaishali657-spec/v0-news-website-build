import { NextRequest, NextResponse } from 'next/server';

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
        articleContext = '\n\nCurrent articles in the feed:\n';
        articles.slice(0, 8).forEach((article: any, index: number) => {
          const title = article.title || 'Untitled';
          const source = article.source || 'Unknown Source';
          const desc = (article.description || '').substring(0, 80);
          articleContext += `${index + 1}. "${title}" from ${source}\n`;
          if (desc) articleContext += `   ${desc}...\n`;
        });
      } catch (e) {
        console.warn('[v0-chat] Error building article context:', e);
        // Continue without article context if it fails
      }
    }

    // [6] BUILD SYSTEM PROMPT
    const systemPrompt = `You are INFORMED Assistant - a knowledgeable news chatbot for the INFORMED news aggregator.

Your responsibilities:
- Answer questions about news, current events, and world affairs
- Summarize and explain news stories in simple terms
- Help users find articles on specific topics
- Provide context and background on news events
- Maintain a professional, friendly, and informative tone
- Keep responses concise but comprehensive (2-3 sentences for quick questions, up to 1 paragraph for detailed requests)
- Always cite article sources when referencing specific stories

Available articles${articleContext}

Guidelines:
- Be accurate and avoid speculation
- If you don't know something, say so
- Help users understand complex news topics
- Stay focused on news and current events
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
