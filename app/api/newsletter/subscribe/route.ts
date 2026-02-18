import { NextRequest, NextResponse } from 'next/server';

interface SubscriptionData {
  email: string;
  frequency: string;
  categories: string[];
  subscribedAt: string;
  active: boolean;
}

// In production, this would store in a database
// For now, we'll use localStorage-like approach and log to console
const subscribers: SubscriptionData[] = [];

// Function to send notification email to admin
async function sendAdminNotification(email: string, frequency: string, categories: string[]) {
  try {
    // Using mailto protocol for client-side email generation
    const subject = `New Newsletter Subscription - ${email}`;
    const body = `
New Newsletter Subscription Received:

Email: ${email}
Frequency: ${frequency}
Categories: ${categories.join(', ')}
Timestamp: ${new Date().toISOString()}
---
This is an automated notification from JustinNews.tech
`;

    // Log to console (visible in server logs)
    console.log('[Newsletter Notification]');
    console.log('To: workwithme785@gmail.com');
    console.log(`Subject: ${subject}`);
    console.log(body);

    // In production, integrate with email service (SendGrid, Mailgun, AWS SES, etc.)
    // For now, we'll return success and let the admin check the logs
    return { success: true };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, frequency, categories } = body;

    // Validation
    if (!email || !frequency || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find((s) => s.email === email);
    if (existingSubscriber) {
      // Update existing subscription
      existingSubscriber.frequency = frequency;
      existingSubscriber.categories = categories;
      existingSubscriber.active = true;
    } else {
      // Add new subscriber
      const subscription: SubscriptionData = {
        email,
        frequency,
        categories,
        subscribedAt: new Date().toISOString(),
        active: true,
      };
      subscribers.push(subscription);
    }

    // Send notification email to admin
    await sendAdminNotification(email, frequency, categories);

    // Log subscription
    console.log('[Newsletter] New subscription:', {
      email,
      frequency,
      categories,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: {
          email,
          frequency,
          categories,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get subscription status
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  const subscriber = subscribers.find((s) => s.email === email);

  if (!subscriber) {
    return NextResponse.json(
      { subscribed: false },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      subscribed: true,
      subscription: subscriber,
    },
    { status: 200 }
  );
}
