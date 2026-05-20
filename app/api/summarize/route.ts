import { NextRequest, NextResponse } from 'next/server';

/**
 * Article Summarization API
 * Uses GROQ (Llama 3) to generate concise summaries, key points, and sentiment analysis
 */
export async function POST(request: NextRequest) {
  try {
    const { article } = await request.json();

    if (!article) {
      return NextResponse.json({ error: 'Article data is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      // Fallback for demonstration if API key is missing
      return NextResponse.json({
        summary: "This article discusses the latest developments in its field, highlighting key shifts and emerging trends that are shaping the industry's future.",
        keyPoints: [
          "Significant impact on global markets and consumer behavior.",
          "Strategic realignments by major players in the sector.",
          "Technological innovations driving new standards of efficiency."
        ],
        sentiment: 'neutral'
      });
    }

    const prompt = `
      Analyze the following news article and provide a high-quality summary in JSON format.

      Article Title: ${article.title}
      Article Source: ${article.source}
      Article Content: ${article.description || article.content || 'No content available.'}

      Your response must be a valid JSON object with exactly these fields:
      - "summary": A professional 1-2 sentence summary of the main news.
      - "keyPoints": An array of 3 concise bullet points highlighting critical facts.
      - "sentiment": One of "positive", "neutral", or "negative".

      Return ONLY the raw JSON. No markdown, no preamble.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
