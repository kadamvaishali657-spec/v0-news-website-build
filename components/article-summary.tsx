'use client';

import { Article } from '@/lib/rss-parser';
import { useState, useEffect } from 'react';
import { Loader2, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface ArticleSummaryProps {
  article: Article;
  onSummaryReady?: (summary: string) => void;
}

interface SummaryData {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export function ArticleSummary({ article, onSummaryReady }: ArticleSummaryProps) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const generateSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('[v0] Fetching summary for article:', article.id);
        
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article }),
        });

        console.log('[v0] Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || `HTTP ${response.status}`;
          console.error('[v0] API error:', errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[v0] Summary received:', data);
        
        if (!data.summary || !Array.isArray(data.keyPoints)) {
          throw new Error('Invalid summary response format');
        }

        setSummary({
          summary: data.summary,
          keyPoints: data.keyPoints,
          sentiment: data.sentiment || 'neutral',
        });

        onSummaryReady?.(data.summary);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        console.error('[v0] Summary generation error:', errorMsg, err);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [article, onSummaryReady]);

  const sentimentColors = {
    positive: 'bg-green-50 border-green-200 text-green-700',
    neutral: 'bg-gray-50 border-gray-200 text-gray-700',
    negative: 'bg-red-50 border-red-200 text-red-700',
  };

  const sentimentIcons = {
    positive: '📈',
    neutral: '📊',
    negative: '📉',
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm font-medium text-blue-900">Generating AI summary...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-900">
            <p className="font-medium">Could not generate summary</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className={`border rounded-lg transition-all duration-200 ${sentimentColors[summary.sentiment]}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-start gap-3 flex-1">
          <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              AI Summary
              <span className="text-lg">{sentimentIcons[summary.sentiment]}</span>
            </h4>
            <p className="text-sm line-clamp-2">{summary.summary}</p>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className={`text-lg transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-current border-opacity-20">
          {/* Key Points */}
          {summary.keyPoints.length > 0 && (
            <div className="mb-3">
              <h5 className="font-semibold text-xs uppercase opacity-75 mb-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Key Points
              </h5>
              <ul className="space-y-1">
                {summary.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm flex gap-2">
                    <span className="opacity-50 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Summary */}
          <div className="text-sm opacity-90">
            <p>{summary.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
