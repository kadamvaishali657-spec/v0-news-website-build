'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';

const SUPPORT_CONTACT = 'workwithme785@gmail.com';
const SUPPORT_TOPICS = [
  {
    title: 'Newsletter Queries',
    description: 'Problems with subscription parameters, delivery schedules, or content indexes.',
    email: `mailto:${SUPPORT_CONTACT}?subject=Newsletter%20Support`,
  },
  {
    title: 'Technical Support',
    description: 'Report XML parser bugs, proxy queries, or browser interface glitches.',
    email: `mailto:${SUPPORT_CONTACT}?subject=Technical%20Support`,
  },
  {
    title: 'Feature Requests',
    description: 'Propose direct new tools, customized designs, or custom feed additions.',
    email: `mailto:${SUPPORT_CONTACT}?subject=Feature%20Request`,
  },
  {
    title: 'Partnerships',
    description: 'For commercial inquiries, licensing parameters, or brand collaborations.',
    email: `mailto:${SUPPORT_CONTACT}?subject=Partnership%20Inquiry`,
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Support <span className="gradient-text">Hub</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Have questions, feedback, or need help configuring feed parameters? Reach out directly or browse our documentation.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Support Email Card */}
          <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-8 mb-16 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <h2 className="text-xl font-bold text-foreground mb-4">Direct Communication Channel</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Our engineering and design desks are highly responsive to RSS and layout optimization queries.
            </p>
            <a
              href={`mailto:${SUPPORT_CONTACT}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200 text-base"
            >
              <Mail className="w-5 h-5" />
              {SUPPORT_CONTACT}
            </a>
            <p className="text-xs text-muted-foreground mt-4">
              Standard response rate: Within 24 business hours
            </p>
          </div>

          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider text-center md:text-left">
              Segmented Inquiries
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {SUPPORT_TOPICS.map((topic) => (
                <a
                  key={topic.title}
                  href={topic.email}
                  className="bg-card/30 border border-border/60 rounded-2xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group shadow-md"
                >
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-base">
                    {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                    {topic.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs text-primary font-semibold">
                    Contact Support
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">
              Frequently Answered Inquiries
            </h2>
            
            <div className="space-y-6">
              <div className="border-b border-border/30 pb-6">
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-2">Can I customize article source feeds?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Yes, fully! Through our custom Admin Dashboard panel, you can add any third-party RSS xml feed url, enable or disable default publications, or restore standard layouts instantaneously.
                </p>
              </div>
              <div className="border-b border-border/30 pb-6">
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-2">How are network CORS failures bypassed?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  To ensure a serverless architecture where DOMParser executes in the browser client, our feeds engine automatically fallbacks to reliable and secure CORS proxies when loading publications that do not broadcast wide CORS response headers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-2">Is user data or bookmarks cataloged?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Never. Informed is entirely serverless and stateless. All configured feeds, read histories, and saved articles reside completely inside your local browser's storage space.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
