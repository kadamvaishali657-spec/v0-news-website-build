/**
 * Enhanced newsletter subscription API with file-based persistence and rate limiting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, unsubscribe, getSubscriptionStatus, getNewsletterStats } from '@/lib/server/newsletter-store';
import { apiRateLimiter, getRateLimitId, rateLimitHeaders } from '@/lib/server/rate-limiter';

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitId(request);
  const rateCheck = apiRateLimiter.check(clientId);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs) }
    );
  }

  try {
    const body = await request.json();
    const { email, frequency = 'weekly', categories = ['Global News', 'Tech & Innovation'], action } = body;

    // Handle unsubscribe
    if (action === 'unsubscribe') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      const success = await unsubscribe(email);
      return NextResponse.json({
        success,
        message: success ? 'Successfully unsubscribed' : 'Email not found or already unsubscribed',
      });
    }

    // Validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency. Use daily, weekly, or monthly.' }, { status: 400 });
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'At least one category is required' }, { status: 400 });
    }

    // Add subscriber (persisted to file)
    const { isNew, subscriber } = await addSubscriber(email, frequency, categories);

    console.log('[Newsletter]', isNew ? 'New subscription' : 'Updated subscription', {
      email: subscriber.email,
      frequency: subscriber.frequency,
      categories: subscriber.categories,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: isNew ? 'Successfully subscribed to newsletter' : 'Subscription preferences updated',
      data: {
        email: subscriber.email,
        frequency: subscriber.frequency,
        categories: subscriber.categories,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const stats = request.nextUrl.searchParams.get('stats');

  // Return newsletter stats if requested
  if (stats === 'true') {
    try {
      const newsletterStats = await getNewsletterStats();
      return NextResponse.json(newsletterStats);
    } catch (error) {
      console.error('Newsletter stats error:', error);
      return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }
  }

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriptionStatus(email);

    if (!subscriber) {
      return NextResponse.json({ subscribed: false });
    }

    return NextResponse.json({
      subscribed: subscriber.active,
      subscription: {
        email: subscriber.email,
        frequency: subscriber.frequency,
        categories: subscriber.categories,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error('Newsletter status error:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
