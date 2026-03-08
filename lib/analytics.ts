'use client';

import { useEffect } from 'react';

interface AnalyticsEvent {
  type: 'article_view' | 'article_save' | 'article_share' | 'settings_change' | 'search_query' | 'category_filter';
  data: Record<string, any>;
  timestamp?: string;
}

export function logAnalytics(event: AnalyticsEvent) {
  try {
    const events = localStorage.getItem('analytics-events') || '[]';
    const parsedEvents = JSON.parse(events);
    parsedEvents.push({
      timestamp: new Date().toISOString(),
      ...event,
    });
    
    // Keep only last 100 events to avoid bloating storage
    const recentEvents = parsedEvents.slice(-100);
    localStorage.setItem('analytics-events', JSON.stringify(recentEvents));
    
    console.log('[Analytics]', event.type, event.data);
  } catch (error) {
    console.error('Analytics logging error:', error);
  }
}

export function useArticleAnalytics(articleId: string, title: string) {
  useEffect(() => {
    // Log article view
    logAnalytics({
      type: 'article_view',
      data: {
        articleId,
        title,
        referrer: document.referrer,
      },
    });
  }, [articleId, title]);
}

export function getAnalyticsReport() {
  try {
    const events = localStorage.getItem('analytics-events') || '[]';
    const parsedEvents = JSON.parse(events);
    
    const report = {
      totalEvents: parsedEvents.length,
      byType: {} as Record<string, number>,
      topArticles: [] as Array<{ id: string; views: number }>,
      lastUpdated: new Date().toISOString(),
    };
    
    const articleViews: Record<string, number> = {};
    
    parsedEvents.forEach((event: AnalyticsEvent) => {
      report.byType[event.type] = (report.byType[event.type] || 0) + 1;
      
      if (event.type === 'article_view' && event.data.articleId) {
        articleViews[event.data.articleId] = (articleViews[event.data.articleId] || 0) + 1;
      }
    });
    
    report.topArticles = Object.entries(articleViews)
      .map(([id, views]) => ({ id, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    return report;
  } catch (error) {
    console.error('Error generating analytics report:', error);
    return null;
  }
}
