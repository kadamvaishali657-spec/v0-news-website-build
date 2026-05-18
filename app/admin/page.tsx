'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { RSSFeed, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Plus, Trash2, Save, Eye, EyeOff, RefreshCw, X, Sliders, Rss, ShieldAlert, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Sliders className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Fine-tune, restructure, and configure the RSS publication index. Set custom endpoints or enable/disable default newsrooms instantly.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center justify-between border animate-slide-down ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              <span className="text-sm font-semibold">
                {message.text}
              </span>
              <button onClick={() => setMessage(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card/40 backdrop-blur-md border border-border/60 p-6 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Indexed Feeds</p>
              <p className="text-3xl font-extrabold text-foreground mt-2">{feeds.length}</p>
            </div>
            <div className="bg-card/40 backdrop-blur-md border border-border/60 p-6 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Active Feeds</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">{activeFeedsCount}</p>
            </div>
            <div className="bg-card/40 backdrop-blur-md border border-border/60 p-6 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Disabled Feeds</p>
              <p className="text-3xl font-extrabold text-destructive mt-2">{disabledFeeds.length}</p>
            </div>
          </div>

          {/* Add Feed Action & Form Card */}
          <div className="mb-8">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200 font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Custom RSS Feed
              </button>
            ) : (
              <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Rss className="w-5 h-5 text-indigo-500" />
                    Register Custom RSS Feed
                  </h2>
                  <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddFeed} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Feed Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., TechCrunch, Wired"
                        value={newFeedTitle}
                        onChange={(e) => setNewFeedTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Tech & Innovation, Global News"
                        value={newFeedCategory}
                        onChange={(e) => setNewFeedCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">RSS Feed XML URL *</label>
                    <input
                      type="url"
                      placeholder="https://example.com/rss.xml"
                      value={newFeedUrl}
                      onChange={(e) => setNewFeedUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-md font-semibold text-xs transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Save Feed Configuration
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-2.5 border border-border hover:bg-muted text-xs font-semibold text-foreground rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Feeds Listing Dashboard */}
          <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-card/60">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Active Source Configurations ({feeds.length})
              </h2>
              <button
                onClick={handleResetToDefault}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            </div>
            
            {feeds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border/45 bg-card/30">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Endpoint URL</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeds.map((feed, index) => {
                      const isDisabled = disabledFeeds.includes(feed.url);
                      return (
                        <tr key={index} className={`border-b border-border/20 hover:bg-muted/10 transition-colors duration-150 ${isDisabled ? 'opacity-50 bg-destructive/5' : ''}`}>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{feed.title}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                              {feed.category || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-muted-foreground truncate max-w-xs" title={feed.url}>{feed.url}</td>
                          <td className="px-6 py-4 text-xs font-semibold">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isDisabled 
                                ? 'bg-destructive/10 border border-destructive/20 text-destructive' 
                                : 'bg-green-500/10 border border-green-500/20 text-green-400'
                            }`}>
                              {isDisabled ? (
                                <>
                                  <EyeOff className="w-3 h-3" /> Disabled
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3" /> Active
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFeed(feed.url)}
                              className={`p-2 rounded-xl border transition-all ${
                                isDisabled 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 shadow-sm hover:shadow-green-500/10' 
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 shadow-sm hover:shadow-amber-500/10'
                              }`}
                              title={isDisabled ? 'Enable feed source' : 'Disable feed source'}
                            >
                              {isDisabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleRemoveFeed(feed.url)}
                              className="p-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all shadow-sm hover:shadow-destructive/10"
                              title="Delete feed source"
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
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center gap-3">
                <ShieldAlert className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
                <p className="font-semibold">No Feeds Configured</p>
                <p className="text-xs">Add a feed URL using the form above to start receiving live tech articles.</p>
              </div>
            )}
          </div>

          {/* Operational Documentation */}
          <div className="mt-8 bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-4">Operational Guidelines</h3>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-3 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>All added RSS urls must point to a valid XML/RSS feed containing properly formatted title, description, and pubDate tags.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>For feeds that fail browser CORS queries, our client auto-attempts to securely channel requests through open CORS proxy endpoints.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Active source state changes are locally processed immediately and saved inside the client storage namespace.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Use the "Reset Defaults" control block above to instantly roll back to standard TechCrunch/Wired/The Verge layouts.</span>
              </li>
            </ul>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
