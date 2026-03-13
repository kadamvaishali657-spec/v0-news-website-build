import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { buildSummarizationPrompt, parseAISummaryResponse } from '@/lib/summarize-utils';
import { Article } from '@/lib/rss-parser';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { article } = await request.json();

    if (!article || !article.id || !article.title || !article.description) {
      return Response.json(
        { error: 'Invalid article data' },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildSummarizationPrompt(article);

    // Call Groq for fast summarization
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.3, // Lower temperature for consistent summaries
      maxTokens: 300, // Keep response concise
    });

    // Parse the response
    const parsed = parseAISummaryResponse(text);

    if (!parsed) {
      return Response.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    return Response.json({
      articleId: article.id,
      title: article.title,
      ...parsed,
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return Response.json(
      { error: 'Failed to summarize article' },
      { status: 500 }
    );
  }
}
