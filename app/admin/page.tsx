'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { RSSFeed, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Plus, Trash2, Save, Eye, EyeOff, RefreshCw, X } from 'lucide-react';

export default function AdminPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedTitle, setNewFeedTitle] = useState('');
  const [newFeedCategory, setNewFeedCategory] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [disabledFeeds, setDisabledFeeds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load feeds and disabled feeds from localStorage
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rss-feeds');
    const savedDisabled = localStorage.getItem('disabled-feeds');
    
    if (savedFeeds) {
      try {
        const parsed = JSON.parse(savedFeeds);
        setFeeds(parsed);
      } catch (e) {
        console.error('Error loading feeds:', e);
      }
    }
    
    if (savedDisabled) {
      try {
        const parsed = JSON.parse(savedDisabled);
        setDisabledFeeds(parsed);
      } catch (e) {
        console.error('Error loading disabled feeds:', e);
      }
    }
  }, []);

  const saveFeedsToStorage = (updatedFeeds: RSSFeed[]) => {
    localStorage.setItem('rss-feeds', JSON.stringify(updatedFeeds));
    sessionStorage.removeItem('articles-session-cache'); // Clear cache when feeds change
  };

  const saveDisabledToStorage = (disabled: string[]) => {
    localStorage.setItem('disabled-feeds', JSON.stringify(disabled));
    sessionStorage.removeItem('articles-session-cache'); // Clear cache when feeds change
  };

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeedUrl.trim() || !newFeedTitle.trim()) {
      setMessage({ type: 'error', text: 'Please fill in URL and title' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Validate URL
    try {
      new URL(newFeedUrl);
    } catch {
      setMessage({ type: 'error', text: 'Please enter a valid URL' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Check for duplicates
    if (feeds.some((f) => f.url === newFeedUrl)) {
      setMessage({ type: 'error', text: 'This feed URL already exists' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newFeed: RSSFeed = { 
      url: newFeedUrl, 
      title: newFeedTitle,
      category: newFeedCategory || undefined
    };
    
    const updatedFeeds = [...feeds, newFeed];
    setFeeds(updatedFeeds);
    saveFeedsToStorage(updatedFeeds);

    setNewFeedUrl('');
    setNewFeedTitle('');
    setNewFeedCategory('');
    setShowAddForm(false);
    setMessage({ type: 'success', text: 'Feed added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemoveFeed = (url: string) => {
    if (confirm('Are you sure you want to remove this feed?')) {
      const updatedFeeds = feeds.filter((f) => f.url !== url);
      setFeeds(updatedFeeds);
      saveFeedsToStorage(updatedFeeds);
      
      // Also remove from disabled list
      const updated = disabledFeeds.filter(u => u !== url);
      setDisabledFeeds(updated);
      saveDisabledToStorage(updated);
      
      setMessage({ type: 'success', text: 'Feed removed successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleFeed = (url: string) => {
    const updated = disabledFeeds.includes(url)
      ? disabledFeeds.filter(u => u !== url)
      : [...disabledFeeds, url];
    
    setDisabledFeeds(updated);
    saveDisabledToStorage(updated);
    
    const isDisabling = updated.includes(url);
    setMessage({ 
      type: 'success', 
      text: `Feed ${isDisabling ? 'disabled' : 'enabled'}!` 
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default feeds? This will remove all custom feeds and enable all defaults.')) {
      setFeeds(DEFAULT_FEEDS);
      setDisabledFeeds([]);
      saveFeedsToStorage(DEFAULT_FEEDS);
      saveDisabledToStorage([]);
      setMessage({ type: 'success', text: 'Reset to default feeds' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const activeFeedsCount = feeds.length - disabledFeeds.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage RSS feeds and published content</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            message.type === 'success' 
              ? 'bg-green-100/20 border border-green-500/30 dark:bg-green-900/20 dark:border-green-700/50' 
              : 'bg-red-100/20 border border-red-500/30 dark:bg-red-900/20 dark:border-red-700/50'
          }`}>
            <span className={message.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
              {message.text}
            </span>
            <button onClick={() => setMessage(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground text-sm font-medium">Total Feeds</p>
            <p className="text-3xl font-bold text-foreground mt-2">{feeds.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground text-sm font-medium">Active Feeds</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{activeFeedsCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground text-sm font-medium">Disabled Feeds</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{disabledFeeds.length}</p>
          </div>
        </div>

        {/* Add Feed Form */}
        <div className="mb-8">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add New Feed
            </button>
          ) : (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Add New RSS Feed</h2>
                <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Feed Title</label>
                  <input
                    type="text"
                    placeholder="e.g., TechCrunch, The Verge"
                    value={newFeedTitle}
                    onChange={(e) => setNewFeedTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">RSS Feed URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/rss.xml"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Technology, Business"
                    value={newFeedCategory}
                    onChange={(e) => setNewFeedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Add Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Feeds List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">RSS Feeds ({feeds.length})</h2>
            <button
              onClick={handleResetToDefault}
              className="text-sm text-accent hover:text-accent/80 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
          
          {feeds.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeds.map((feed, index) => {
                    const isDisabled = disabledFeeds.includes(feed.url);
                    return (
                      <tr key={index} className={`border-b border-border hover:bg-secondary/30 ${isDisabled ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{feed.title}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{feed.category || '-'}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate" title={feed.url}>{feed.url}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isDisabled 
                              ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' 
                              : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                          }`}>
                            {isDisabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleToggleFeed(feed.url)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDisabled 
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60' 
                                : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60'
                            }`}
                            title={isDisabled ? 'Enable feed' : 'Disable feed'}
                          >
                            {isDisabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleRemoveFeed(feed.url)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                            title="Delete feed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">No feeds configured</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add a feed to get started</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">How to Use</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Click "Add New Feed" to add an RSS feed</li>
            <li>• Toggle the eye icon to enable/disable feeds</li>
            <li>• Delete feeds you no longer want to use</li>
            <li>• Changes are saved to your browser automatically</li>
            <li>• Only active feeds appear on the home page</li>
            <li>• Use "Reset to Default" to restore original feeds</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
