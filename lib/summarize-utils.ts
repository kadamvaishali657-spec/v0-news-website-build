import { Article } from './rss-parser';

export interface SummaryResult {
  articleId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Build a concise prompt for AI summarization
 * Focuses on extracting core message and key insights
 */
export function buildSummarizationPrompt(article: Article): string {
  return `You are a professional news summarizer. Analyze this article and provide a concise summary.

Article Title: "${article.title}"
Article Content: "${article.description}"
Source: ${article.source}

Please provide:
1. A 2-3 sentence summary capturing the core message
2. 2-3 key points in a bullet list format
3. Overall sentiment (positive, neutral, or negative)

Format your response as JSON with this structure:
{
  "summary": "2-3 sentence summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive|neutral|negative"
}`;
}

/**
 * Parse the AI response safely
 */
export function parseAISummaryResponse(responseText: string): Omit<SummaryResult, 'articleId' | 'title'> | null {
  try {
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      sentiment: ['positive', 'neutral', 'negative'].includes(parsed.sentiment)
        ? parsed.sentiment
        : 'neutral',
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}
