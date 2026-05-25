'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Settings, Moon, Sun, Bell, Share2, BarChart3, Trash2 } from 'lucide-react';
import { getAnalyticsReport } from '@/lib/analytics';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    twitter: true,
    linkedin: true,
    whatsapp: true,
  });
  const [analyticsReport, setAnalyticsReport] = useState<any>(null);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('user-preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setDarkMode(prefs.darkMode || false);
      setNotifications(prefs.notifications || true);
      setEmailDigest(prefs.emailDigest || false);
      setShareSettings(prefs.shareSettings || shareSettings);
    }

    // Load analytics
    const report = getAnalyticsReport();
    if (report) {
      setAnalyticsReport(report);
    }
  }, []);

  const savePreferences = () => {
    const preferences = {
      darkMode,
      notifications,
      emailDigest,
      shareSettings,
    };
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
    alert('Settings saved successfully!');
  };

  const clearAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      localStorage.removeItem('analytics-events');
      setAnalyticsReport(null);
      alert('Analytics data cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-foreground">Settings</h1>
              <p className="text-foreground/60 mt-1 font-medium">Customize your news experience</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Display Settings */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 rounded-2xl border border-border/40 p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Sun className="w-5 h-5 text-accent" />
              </div>
              Display Settings
            </h2>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all ${
                  darkMode ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                }`} />
                {darkMode && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
              </div>
              <span className="text-foreground font-medium">Dark Mode (Beta)</span>
            </label>
          </div>

          {/* Notification Settings */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 rounded-2xl border border-border/40 p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    notifications ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                  }`} />
                  {notifications && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
                <span className="text-foreground font-medium">Breaking News Alerts</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    emailDigest ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                  }`} />
                  {emailDigest && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
                <span className="text-foreground font-medium">Daily Email Digest</span>
              </label>
            </div>
          </div>

          {/* Sharing Settings */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 rounded-2xl border border-border/40 p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Share2 className="w-5 h-5 text-accent" />
              </div>
              Sharing Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={shareSettings.twitter}
                    onChange={(e) => setShareSettings({...shareSettings, twitter: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    shareSettings.twitter ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                  }`} />
                  {shareSettings.twitter && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
                <span className="text-foreground font-medium">Enable Twitter Sharing</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={shareSettings.linkedin}
                    onChange={(e) => setShareSettings({...shareSettings, linkedin: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    shareSettings.linkedin ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                  }`} />
                  {shareSettings.linkedin && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
                <span className="text-foreground font-medium">Enable LinkedIn Sharing</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={shareSettings.whatsapp}
                    onChange={(e) => setShareSettings({...shareSettings, whatsapp: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    shareSettings.whatsapp ? 'bg-accent border-accent' : 'border-border/40 group-hover:border-border/60'
                  }`} />
                  {shareSettings.whatsapp && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
                <span className="text-foreground font-medium">Enable WhatsApp Sharing</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={savePreferences}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold hover:shadow-lg hover:shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 text-lg"
          >
            Save Settings
          </button>

          {/* Analytics Dashboard */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 rounded-2xl border border-border/40 p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              Usage Analytics
            </h2>
            
            {analyticsReport ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-background/60 to-background/40 rounded-lg p-5 border border-border/30">
                    <p className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2">Total Events</p>
                    <p className="text-3xl font-black text-accent">{analyticsReport.totalEvents}</p>
                  </div>
                  <div className="bg-gradient-to-br from-background/60 to-background/40 rounded-lg p-5 border border-border/30">
                    <p className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2">Article Views</p>
                    <p className="text-3xl font-black text-accent">
                      {analyticsReport.byType.article_view || 0}
                    </p>
                  </div>
                </div>

                {analyticsReport.topArticles && analyticsReport.topArticles.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Top 5 Articles</p>
                    <div className="space-y-3">
                      {analyticsReport.topArticles.slice(0, 5).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-gradient-to-r from-background/40 to-background/20 rounded-lg p-4 border border-border/20 hover:border-border/40 transition-colors">
                          <span className="text-sm text-foreground/80 truncate font-medium">{item.id}</span>
                          <span className="text-sm font-black text-accent ml-4">{item.views}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearAnalytics}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-destructive/80 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-lg transition-all border border-destructive/20 hover:border-destructive/40"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Analytics
                </button>
              </div>
            ) : (
              <p className="text-foreground/60 text-sm font-medium">No analytics data yet. Start browsing articles to see stats.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
