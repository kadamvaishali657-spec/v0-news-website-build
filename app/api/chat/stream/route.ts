/**
 * Streaming chat API endpoint.
 * Provides real-time AI responses using Server-Sent Events for a smooth UX.
 */

import { NextRequest } from 'next/server';
import { chatRateLimiter, getRateLimitId } from '@/lib/server/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ArticleContext {
  title: string;
  source: string;
  category?: string;
  description: string;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitId(request);
  const rateCheck = chatRateLimiter.check(clientId);
  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many chat requests. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return new Response(
      JSON.stringify({ error: 'Groq API key not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { messages, articles } = body as { messages: ChatMessage[]; articles?: ArticleContext[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build article context
    let articleContext = '';
    if (articles && Array.isArray(articles) && articles.length > 0) {
      articleContext = '\n\nCurrent articles available on the news feed:\n';
      articles.slice(0, 15).forEach((article: ArticleContext, index: number) => {
        articleContext += `${index + 1}. "${article.title}" from ${article.source}${article.category ? ` [${article.category}]` : ''}\n   ${article.description.substring(0, 120)}...\n`;
      });
    }

    const systemPrompt = `You are a highly knowledgeable news assistant for JustinNews.tech, a premium global news aggregator.

Your capabilities:
1. Answer questions about news articles and current events with depth and insight
2. Provide concise, well-structured summaries of news stories
3. Help users discover articles by topic, region, or category
4. Offer analysis and context for complex news stories
5. Compare coverage across different sources
6. Identify trends and patterns in the news

Style guidelines:
- Be conversational yet professional
- Use bullet points and formatting for clarity when appropriate
- Cite specific article titles and sources when relevant
- Keep responses focused and concise (2-4 paragraphs max)
- When unsure, say so rather than speculating${articleContext}

Current time: ${new Date().toLocaleString()}`;

    // Call Groq API with streaming
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((msg: ChatMessage) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq streaming error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response' }),
        { status: groqResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response using a TransformStream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;

              const data = trimmed.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat stream error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
