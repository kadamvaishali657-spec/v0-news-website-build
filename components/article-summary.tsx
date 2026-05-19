'use client';

import { Article } from '@/lib/rss-parser';
import { useState, useEffect } from 'react';
import { Loader2, Sparkles, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';

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
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || `HTTP ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

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
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [article, onSummaryReady]);

  const sentimentConfig = {
    positive: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: '📈' },
    neutral: { bg: 'bg-primary/5', border: 'border-primary/10', text: 'text-foreground', icon: '📊' },
    negative: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-600 dark:text-red-400', icon: '📉' },
  };

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">Generating AI summary</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Could not generate summary</p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const config = sentimentConfig[summary.sentiment];

  return (
    <div className={`rounded-xl border transition-all duration-200 ${config.bg} ${config.border}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start justify-between hover:opacity-90 transition-opacity"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-foreground">
              AI Summary
              <span className="text-base">{config.icon}</span>
            </h4>
            <p className={`text-sm line-clamp-2 ${config.text}`}>{summary.summary}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/20 mx-4 mb-0">
          {summary.keyPoints.length > 0 && (
            <div className="mt-3 mb-3">
              <h5 className="font-semibold text-xs uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Key Points
              </h5>
              <ul className="space-y-1.5">
                {summary.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm flex gap-2 text-foreground/80">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
