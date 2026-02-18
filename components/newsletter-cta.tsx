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
    <section className="bg-accent/10 border-y border-border py-12 my-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Mail className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Stay Updated</h2>
        </div>
        
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Get personalized news delivered to your inbox. Choose your topics and receive daily, weekly, or monthly digests.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitted}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={loading || submitted}
              className="whitespace-nowrap"
            >
              {submitted ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Subscribed!
                </span>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/newsletter"
              className="px-4 py-2 text-sm text-accent hover:text-accent/80 font-medium underline"
            >
              Customize topics
            </Link>
            <span className="text-muted-foreground">or</span>
            <a
              href="mailto:workwithme785@gmail.com?subject=Newsletter%20Support"
              className="px-4 py-2 text-sm text-accent hover:text-accent/80 font-medium underline"
            >
              Get support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
