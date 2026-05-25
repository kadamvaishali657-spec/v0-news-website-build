'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Mail, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

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
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20">
              <Mail className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-5">Stay Updated</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
            Subscribe to personalized news delivered to your inbox. Choose your topics and frequency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Subscription Form */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-5 py-3 bg-gradient-to-br from-background/60 to-background/40 border border-border/40 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-medium"
                />
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                  Delivery Frequency
                </label>
                <div className="space-y-3">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-start p-4 border border-border/40 bg-gradient-to-r from-background/30 to-background/10 rounded-lg cursor-pointer hover:border-accent/40 hover:bg-gradient-to-r hover:from-background/50 hover:to-background/20 transition-all group">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={frequency === option.value}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        frequency === option.value
                          ? 'bg-accent border-accent'
                          : 'border-border/40 group-hover:border-accent'
                      }`}>
                        {frequency === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="ml-4">
                        <p className="font-bold text-foreground">{option.label}</p>
                        <p className="text-sm text-foreground/60 mt-1">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-bold hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>

              {/* Messages */}
              {submitted && (
                <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-medium">Successfully subscribed! Check your email for confirmation.</p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive/80 font-medium">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Topics Selection */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
            <h2 className="text-2xl font-black text-foreground mb-2">Choose Topics</h2>
            <p className="text-foreground/60 mb-8 font-medium">
              Select news categories for your newsletter.
            </p>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category} className="flex items-center p-4 border border-border/40 bg-gradient-to-r from-background/30 to-background/10 rounded-lg cursor-pointer hover:border-accent/40 hover:bg-gradient-to-r hover:from-background/50 hover:to-background/20 transition-all group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-accent border-accent'
                      : 'border-border/40 group-hover:border-accent'
                  }`}>
                    {selectedCategories.includes(category) && <div className="text-white text-xs font-bold">✓</div>}
                  </div>
                  <span className="ml-4 text-foreground font-medium">{category}</span>
                </label>
              ))}
            </div>

            {selectedCategories.length === 0 && (
              <p className="text-sm text-amber-600 mt-6 font-medium">Please select at least one category</p>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-foreground mb-3">Personalized</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Get news curated to your interests and preferences.
            </p>
          </div>
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-foreground mb-3">Flexible</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Choose how often and what topics you want to receive.
            </p>
          </div>
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-foreground mb-3">Easy to Manage</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Update your preferences or unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-accent/10 border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Need Help?</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Have questions about your subscription or need assistance? Get in touch with our support team.
          </p>
          <a
            href="mailto:workwithme785@gmail.com?subject=Newsletter%20Support"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
