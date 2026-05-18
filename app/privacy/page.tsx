'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Shield, Lock, Eye, Cookie, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Lock,
      title: '1. No Databases or User Accounts',
      content: 'Informed is a completely serverless, stateless RSS feed aggregator. We do not require accounts, logins, email verification, or third-party OAuth access. Because of this architectural design, we do not capture, register, or maintain any personal profile databases on our servers.'
    },
    {
      icon: Eye,
      title: '2. Local Browser Storage Only',
      content: 'All configuration settings, active or inactive feeds, bookmarks, and display states (such as custom added XML feeds) are stored directly in your browser’s local storage (localStorage). This data never leaves your machine, is completely managed by your own browser settings, and can be cleared by you at any time.'
    },
    {
      icon: Shield,
      title: '3. Feed Requests and Proxy Integration',
      content: 'When you fetch articles, your browser executes a direct XML fetch request to the public RSS feed URLs. However, to bypass browser-enforced CORS (Cross-Origin Resource Sharing) restrictions on feeds that do not broadcast wide CORS headers, we utilize open proxy networks (such as api.allorigins.win). These third-party proxies simply pass the raw XML data through without logging or storing your request content.'
    },
    {
      icon: Cookie,
      title: '4. External Links and Content',
      content: 'Informed aggregates and references articles belonging to third-party publishers (such as TechCrunch, The Verge, or the New York Times). Clicking "Read full article" redirects you to the respective publisher’s domain. We have no authority over external websites and encourage you to review their specific privacy policies concerning cookies, trackers, and data logging.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to News Desk
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Last updated: May 18, 2026. Learn how we handle aggregation transparently, putting you in absolute control of your data.
            </p>
          </div>
        </section>

        {/* Core Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Introductory Summary card */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 mb-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Privacy Commitment
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Informed is designed with privacy-first principles. We believe that your browsing activity, news interests, and subscription lists should remain exclusively yours. We do not use third-party tracking scripts, analytic cookies, behavioral advertising tracking pixel scripts, or tracking cookies.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {sections.map(({ icon: Icon, title, content }) => (
              <section key={title} className="bg-card border border-border/40 p-6 md:p-8 rounded-2xl">
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-primary/80" />
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7.5">
                  {content}
                </p>
              </section>
            ))}
          </div>

          {/* Data Clearance Section */}
          <section className="bg-card border border-border/40 p-6 md:p-8 rounded-2xl mt-8">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2.5">
              5. How to Clear Your Data
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Since all configurations exist within your own browser, you are in absolute charge. If you want to wipe clean all custom feeds, reading histories, preferences, and saved articles, you can clear your browser storage or press the button below:
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Your client-side storage has been successfully wiped clean!');
                window.location.href = '/';
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-destructive/20 hover:bg-destructive/10 text-destructive text-xs font-semibold transition-all duration-200"
            >
              Wipe Client Storage Now
            </button>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
