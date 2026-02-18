'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Settings, Moon, Sun, Bell, Share2 } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    twitter: true,
    linkedin: true,
    whatsapp: true,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">Customize your news reading experience</p>
        </div>

        <div className="space-y-6">
          {/* Display Settings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-accent" />
              Display Settings
            </h2>
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-foreground">Dark Mode</span>
            </label>
          </div>

          {/* Notification Settings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Breaking News Alerts</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Daily Email Digest</span>
              </label>
            </div>
          </div>

          {/* Sharing Settings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-accent" />
              Sharing Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareSettings.twitter}
                  onChange={(e) => setShareSettings({...shareSettings, twitter: e.target.checked})}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Enable Twitter Sharing</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareSettings.linkedin}
                  onChange={(e) => setShareSettings({...shareSettings, linkedin: e.target.checked})}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Enable LinkedIn Sharing</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareSettings.whatsapp}
                  onChange={(e) => setShareSettings({...shareSettings, whatsapp: e.target.checked})}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Enable WhatsApp Sharing</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={savePreferences}
            className="w-full px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
