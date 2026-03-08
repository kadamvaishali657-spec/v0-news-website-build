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
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Newsletter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get curated tech news from 25+ premium sources delivered to your inbox. Personalized, flexible, and easy to manage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Subscription Form */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                />
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Delivery Frequency
                </label>
                <div className="space-y-3">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={frequency === option.value}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Choose Topics</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Select the categories you'd like to receive in your newsletter.
            </p>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-900 font-medium">{category}</span>
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
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-gray-900 mb-3 text-lg">Personalized</h3>
            <p className="text-gray-600">
              Curated news tailored to your interests and reading preferences.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-gray-900 mb-3 text-lg">Flexible</h3>
            <p className="text-gray-600">
              Choose your delivery frequency and topics that matter to you.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-gray-900 mb-3 text-lg">Easy to Manage</h3>
            <p className="text-gray-600">
              Update preferences or unsubscribe anytime, no questions asked.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-200 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Need Help?</h2>
          </div>
          <p className="text-gray-700 mb-6 font-medium">
            Have questions or need support? Our team is ready to help you get the most from your newsletter.
          </p>
          <a
            href="mailto:workwithme785@gmail.com?subject=Newsletter%20Support"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
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
