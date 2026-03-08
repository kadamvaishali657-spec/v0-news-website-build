'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          frequency: 'weekly',
          categories: ['Global News', 'Tech & Innovation'],
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 my-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white">Get Daily News</h2>
            </div>
            
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Personalized tech news and breaking stories delivered straight to your inbox. Stay informed without the clutter.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-50">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Curated from 25+ premium sources</span>
              </div>
              <div className="flex items-center gap-2 text-blue-50">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Choose your topics and frequency</span>
              </div>
              <div className="flex items-center gap-2 text-blue-50">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Unsubscribe anytime</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitted}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 font-medium"
              />
              <Button
                type="submit"
                disabled={loading || submitted}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {submitted ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Subscribed Successfully!
                  </span>
                ) : (
                  'Subscribe for Free'
                )}
              </Button>
            </form>
            
            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Or customize your preferences
              </p>
              <Link
                href="/newsletter"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                Go to Newsletter Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
