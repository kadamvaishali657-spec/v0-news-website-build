'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';

const SUPPORT_CONTACT = 'workwithme785@gmail.com';
const SUPPORT_TOPICS = [
  {
    title: 'Newsletter Issues',
    description: 'Problems with subscription, frequency, or delivery',
    email: `mailto:${SUPPORT_CONTACT}?subject=Newsletter%20Support`,
  },
  {
    title: 'Technical Support',
    description: 'Report bugs or technical issues with the website',
    email: `mailto:${SUPPORT_CONTACT}?subject=Technical%20Support`,
  },
  {
    title: 'Feature Requests',
    description: 'Suggest new features or improvements',
    email: `mailto:${SUPPORT_CONTACT}?subject=Feature%20Request`,
  },
  {
    title: 'Partnership & Collaboration',
    description: 'Business inquiries and collaboration opportunities',
    email: `mailto:${SUPPORT_CONTACT}?subject=Partnership%20Inquiry`,
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? Our support team is here to help. Reach out to us for any inquiries.
          </p>
        </div>

        {/* Main Contact Section */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Primary Support Email</h2>
          <a
            href={`mailto:${SUPPORT_CONTACT}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-lg"
          >
            <Mail className="w-6 h-6" />
            {SUPPORT_CONTACT}
          </a>
          <p className="text-muted-foreground mt-4">
            We typically respond within 24 business hours
          </p>
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How Can We Help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {SUPPORT_TOPICS.map((topic) => (
              <a
                key={topic.title}
                href={topic.email}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {topic.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-accent font-medium">
                  Contact Support
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-accent/10 border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground mb-2">How do I update my newsletter preferences?</h3>
              <p className="text-muted-foreground">
                You can update your newsletter preferences anytime by visiting the Newsletter section. You can change your delivery frequency, topics, or email address.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">How do I unsubscribe from the newsletter?</h3>
              <p className="text-muted-foreground">
                You can unsubscribe by clicking the unsubscribe link in any newsletter email, or by contacting us at {SUPPORT_CONTACT}.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">What if I'm not receiving newsletters?</h3>
              <p className="text-muted-foreground">
                Check your spam folder or email filters. If newsletters are still not arriving, please reach out to us with your email address and subscription details.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Can I customize article sources?</h3>
              <p className="text-muted-foreground">
                Yes! You can select specific news topics during subscription. Contact us if you'd like to suggest additional sources or categories.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
