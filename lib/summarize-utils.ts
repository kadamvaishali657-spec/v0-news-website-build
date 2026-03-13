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
  const content = article.description || article.title || 'No content available';
  
  return `You are a professional news summarizer. Analyze this article and provide a concise summary.

Article Title: "${article.title}"
Article Content: "${content}"
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

/**
 * Generate a fallback summary when AI API fails
 * Extracts key information from article content
 */
export function generateFallbackSummary(article: Article): Omit<SummaryResult, 'articleId' | 'title'> {
  // Use description if available, otherwise use title
  const description = article.description || article.title;
  const text = `${article.title} ${description}`;
  
  // Extract first 1-2 sentences as summary
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const summary = sentences.slice(0, 2).join(' ').trim().substring(0, 200) || article.title;
  
  // Generate key points from available content
  const contentSentences = (description || '').match(/[^.!?]+[.!?]+/g) || [];
  const keyPoints = contentSentences
    .slice(0, 3)
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  // Detect sentiment based on keywords
  const positiveKeywords = ['increase', 'growth', 'boost', 'improve', 'succeed', 'gain', 'positive', 'strong', 'excellent'];
  const negativeKeywords = ['decline', 'fall', 'loss', 'fail', 'negative', 'weak', 'poor', 'crisis', 'problem'];
  
  const textLower = text.toLowerCase();
  const positiveCount = positiveKeywords.filter(k => textLower.includes(k)).length;
  const negativeCount = negativeKeywords.filter(k => textLower.includes(k)).length;
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  if (negativeCount > positiveCount) sentiment = 'negative';
  
  return {
    summary: summary || 'Summary not available',
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Check source for full details'],
    sentiment,
  };
}
