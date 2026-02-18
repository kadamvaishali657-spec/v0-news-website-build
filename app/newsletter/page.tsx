'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily Digest', description: 'Get the top stories every morning' },
  { value: 'weekly', label: 'Weekly Roundup', description: 'Best stories from the week' },
  { value: 'monthly', label: 'Monthly Digest', description: 'Highlights from the month' },
];

const CATEGORY_OPTIONS = [
  'Global News',
  'Tech & Innovation',
  'Business & Finance',
  'Sports',
  'Entertainment & Culture',
  'Learning & Education',
  'Social Media Digest',
  'Random Interesting',
];

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Global News', 'Tech & Innovation']);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          frequency,
          categories: selectedCategories,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setSubmitted(true);
      setEmail('');
      setSelectedCategories(['Global News', 'Tech & Innovation']);
      setFrequency('weekly');

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Mail className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Stay Updated</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Subscribe to our newsletter and get personalized news delivered to your inbox. Choose your preferred topics and frequency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Subscription Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Delivery Frequency
                </label>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={frequency === option.value}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-4 h-4 text-accent"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe to Newsletter'
                )}
              </button>

              {/* Messages */}
              {submitted && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">Successfully subscribed! Check your email for confirmation.</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Topics Selection */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Choose Topics</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select the news categories you want to receive in your newsletter.
            </p>
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-accent rounded"
                  />
                  <span className="ml-3 text-foreground font-medium">{category}</span>
                </label>
              ))}
            </div>

            {selectedCategories.length === 0 && (
              <p className="text-sm text-orange-600 mt-4">Please select at least one category</p>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h3 className="font-bold text-foreground mb-2">Personalized</h3>
            <p className="text-sm text-muted-foreground">
              Get news curated to your interests and preferences.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h3 className="font-bold text-foreground mb-2">Flexible</h3>
            <p className="text-sm text-muted-foreground">
              Choose how often and what topics you want to receive.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h3 className="font-bold text-foreground mb-2">Easy to Manage</h3>
            <p className="text-sm text-muted-foreground">
              Update your preferences or unsubscribe anytime.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
