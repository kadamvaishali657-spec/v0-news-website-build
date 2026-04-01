'use client';

import { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
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
    <section className="relative overflow-hidden my-12">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.05] to-pink-500/[0.07]" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Mail className="w-3.5 h-3.5" />
            Newsletter
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Stay <span className="gradient-text">Updated</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Subscribe to receive news updates. Choose your preferred topics and frequency.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitted}
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border/60 rounded-xl text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all disabled:opacity-50 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || submitted}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <Link
            href="/newsletter"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Customize topics
          </Link>
          <span className="text-muted-foreground/50">&middot;</span>
          <a
            href="mailto:workwithme785@gmail.com?subject=Newsletter%20Support"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Get support
          </a>
        </div>
      </div>
    </section>
  );
}
