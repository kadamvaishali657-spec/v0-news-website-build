'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { RSSFeed, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Plus, Trash2, Save } from 'lucide-react';

export default function AdminPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedTitle, setNewFeedTitle] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load feeds from localStorage
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rss-feeds');
    if (savedFeeds) {
      try {
        const parsed = JSON.parse(savedFeeds);
        setFeeds(parsed);
      } catch (e) {
        // Silently ignore parse errors
      }
    }
  }, []);

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeedUrl.trim() || !newFeedTitle.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both URL and title' });
      return;
    }

    // Validate URL
    try {
      new URL(newFeedUrl);
    } catch {
      setMessage({ type: 'error', text: 'Please enter a valid URL' });
      return;
    }

    // Check for duplicates
    if (feeds.some((f) => f.url === newFeedUrl)) {
      setMessage({ type: 'error', text: 'This feed URL already exists' });
      return;
    }

    const updatedFeeds = [...feeds, { url: newFeedUrl, title: newFeedTitle }];
    setFeeds(updatedFeeds);
    localStorage.setItem('rss-feeds', JSON.stringify(updatedFeeds));

    setNewFeedUrl('');
    setNewFeedTitle('');
    setMessage({ type: 'success', text: 'Feed added successfully!' });

    // Refresh the page to load new articles
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleRemoveFeed = (url: string) => {
    if (confirm('Are you sure you want to remove this feed?')) {
      const updatedFeeds = feeds.filter((f) => f.url !== url);
      setFeeds(updatedFeeds);
      localStorage.setItem('rss-feeds', JSON.stringify(updatedFeeds));
      setMessage({ type: 'success', text: 'Feed removed successfully!' });

      // Refresh the page to update articles
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default feeds? This will remove all custom feeds.')) {
      setFeeds(DEFAULT_FEEDS);
      localStorage.setItem('rss-feeds', JSON.stringify(DEFAULT_FEEDS));
      setMessage({ type: 'success', text: 'Reset to default feeds' });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage RSS feed sources for Just in news</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-900/20 border-green-700 text-green-200'
                : 'bg-red-900/20 border-red-700 text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Feed Form */}
        <section className="mb-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Add New Feed</h2>
          <form onSubmit={handleAddFeed} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Feed Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., TechCrunch, The Verge"
                value={newFeedTitle}
                onChange={(e) => setNewFeedTitle(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                RSS Feed URL
              </label>
              <input
                id="url"
                type="url"
                placeholder="https://example.com/rss.xml"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Feed
            </button>
          </form>
        </section>

        {/* Feeds List */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Current Feeds ({feeds.length})</h2>
            <button
              onClick={handleResetToDefault}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Reset to Default
            </button>
          </div>

          {feeds.length > 0 ? (
            <div className="space-y-3">
              {feeds.map((feed) => (
                <div
                  key={feed.url}
                  className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-foreground">{feed.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{feed.url}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFeed(feed.url)}
                    className="ml-4 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove feed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No feeds added. Add one to get started!
            </div>
          )}
        </section>

        {/* Info Box */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Tips</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• Use valid RSS feed URLs (usually end with .xml or /rss)</li>
            <li>• Feed titles help organize your news sources</li>
            <li>• Changes are saved locally in your browser</li>
            <li>• Articles are filtered by title and description keywords</li>
            <li>• Some RSS feeds may have CORS restrictions</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
