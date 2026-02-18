import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    // Create messages array with system message
    const conversationMessages = [
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Generate response using Groq
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: conversationMessages,
      temperature: 0.7,
      maxTokens: 500,
    });

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    );
  }
}
