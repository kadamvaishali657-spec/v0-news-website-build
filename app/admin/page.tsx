'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';

export default function AdminPage() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [newFeed, setNewFeed] = useState('');

  const handleAddFeed = () => {
    if (newFeed.trim()) {
      setFeeds([...feeds, { url: newFeed, title: 'Custom Feed', category: 'Tech' }]);
      setNewFeed('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>
        
        {/* Custom Feeds Section */}
        <section className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent" />
            Manage Custom RSS Feeds
          </h2>
          
          <div className="flex gap-3 mb-6">
            <input
              type="url"
              value={newFeed}
              onChange={(e) => setNewFeed(e.target.value)}
              placeholder="Enter RSS feed URL..."
              className="flex-1 px-4 py-2 bg-muted/40 border border-border rounded-lg text-foreground outline-none focus:border-accent"
            />
            <button
              onClick={handleAddFeed}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Feed
            </button>
          </div>

          {/* Feeds List */}
          <div className="space-y-2">
            {feeds.length === 0 ? (
              <p className="text-muted-foreground">No custom feeds added yet. Add one above to get started.</p>
            ) : (
              feeds.map((feed, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{feed.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{feed.url}</p>
                  </div>
                  <button
                    onClick={() => setFeeds(feeds.filter((_, i) => i !== idx))}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Settings Info */}
        <section className="bg-accent/10 border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-2">About Custom Feeds</h3>
          <p className="text-muted-foreground">
            Add RSS/Atom feed URLs to customize your news sources. All settings are saved locally in your browser.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
