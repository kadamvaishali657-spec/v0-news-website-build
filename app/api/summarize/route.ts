import { buildSummarizationPrompt, parseAISummaryResponse, generateFallbackSummary } from '@/lib/summarize-utils';
import { Article } from '@/lib/rss-parser';

export async function POST(request: Request) {
  try {
    const { article } = await request.json();

    // Validate minimum required fields
    if (!article || !article.id || !article.title) {
      console.error('[v0] Invalid article data:', article);
      return Response.json(
        { error: 'Invalid article data' },
        { status: 400 }
      );
    }

    // Use description if available, otherwise use title
    const contentToSummarize = article.description || article.title;
    
    console.log('[v0] Starting summarization for article:', article.id, 'with content length:', contentToSummarize.length);

    // Check if Groq API key is available
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[v0] GROQ_API_KEY is not set');
      // Use fallback summarization
      const fallback = generateFallbackSummary(article);
      return Response.json({
        articleId: article.id,
        title: article.title,
        ...fallback,
      });
    }

    console.log('[v0] Using Groq API with key:', apiKey.substring(0, 10) + '...');

    // Build the prompt with available content
    const articleWithContent = { ...article, description: contentToSummarize };
    const prompt = buildSummarizationPrompt(articleWithContent);

    // Call Groq API directly
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    console.log('[v0] Groq HTTP status:', groqResponse.status);

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('[v0] Groq API error:', errorData);
      
      // Use fallback on API error
      const fallback = generateFallbackSummary(article);
      return Response.json({
        articleId: article.id,
        title: article.title,
        ...fallback,
      });
    }

    const groqData = await groqResponse.json();
    console.log('[v0] Groq response received');

    // Extract text from Groq response
    const aiText = groqData.choices?.[0]?.message?.content;
    if (!aiText) {
      console.error('[v0] No content in Groq response:', groqData);
      const fallback = generateFallbackSummary(article);
      return Response.json({
        articleId: article.id,
        title: article.title,
        ...fallback,
      });
    }

    // Parse the response
    const parsed = parseAISummaryResponse(aiText);

    if (!parsed) {
      console.error('[v0] Failed to parse AI response:', aiText);
      const fallback = generateFallbackSummary(article);
      return Response.json({
        articleId: article.id,
        title: article.title,
        ...fallback,
      });
    }

    console.log('[v0] Successfully generated summary for article:', article.id);

    return Response.json({
      articleId: article.id,
      title: article.title,
      ...parsed,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[v0] Summarization error:', errorMessage);
    console.error('[v0] Full error:', error);
    
    // Try to extract article from request for fallback
    try {
      const requestBody = await request.clone().json();
      const fallback = generateFallbackSummary(requestBody.article);
      return Response.json({
        articleId: requestBody.article.id,
        title: requestBody.article.title,
        ...fallback,
      });
    } catch {
      return Response.json(
        { error: `Failed to summarize article: ${errorMessage}` },
        { status: 500 }
      );
    }
  }
}
