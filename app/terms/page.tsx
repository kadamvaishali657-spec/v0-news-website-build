'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FileText, Award, Scale, HelpCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const termsList = [
    {
      icon: Scale,
      title: '1. Aggregator and RSS Usage',
      content: 'JustinNews.tech is a client-side technology news aggregator that loads public, standard XML schemas (RSS/Atom feeds). By accessing our website, you understand and acknowledge that all headlines, summaries, full article links, and publisher logos displayed belong entirely to their respective authors and media outlets.'
    },
    {
      icon: Award,
      title: '2. Intellectual Property & Brand Ownership',
      content: 'The articles and images indexed by this platform are the property of their publishers (such as TechCrunch, The Verge, NY Times). We do not claim authorship, licensing, or commercial distribution rights over foreign feed elements. The source code of JustinNews.tech itself is open source and can be modified or deployed under general public terms.'
    },
    {
      icon: AlertCircle,
      title: '3. Disclaimer of Content & Availability',
      content: 'We rely entirely on external publisher XML formats and independent browser CORS proxies to load data. As a result, JustinNews.tech does not warrant or guarantee that RSS feeds will always be reachable, that parsed image formats will render perfectly, or that third-party proxy networks will be free of lag or rate limits. We provide this client-side template strictly "as is" and "as available".'
    },
    {
      icon: HelpCircle,
      title: '4. Permitted and Custom Configurations',
      content: 'Our Admin panel allows you to dynamically insert your own custom XML feeds. You are solely responsible for ensuring that the URLs you supply are valid, secure, and that you do not utilize URLs containing destructive parameters. We reserve the right to locally clean and filter configurations in your browser session if they cause rendering loops.'
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
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Last updated: May 18, 2026. Please read our guidelines on feed ownership, aggregator boundaries, and software licensing.
            </p>
          </div>
        </section>

        {/* Terms Sections */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* General Acceptance */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 mb-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h2 className="text-lg font-bold text-foreground mb-2">Acceptance of Agreement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By launching and interacting with JustinNews.tech, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to the client-side parsing rules, direct network requests, or disclaimers, you should immediately cease using the platform.
            </p>
          </div>

          {/* Terms List */}
          <div className="space-y-6">
            {termsList.map(({ icon: Icon, title, content }) => (
              <section key={title} className="bg-card border border-border/40 p-6 md:p-8 rounded-2xl animate-fade-in">
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-primary/85" />
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7.5">
                  {content}
                </p>
              </section>
            ))}
          </div>

          {/* Contact or Escalation Box */}
          <section className="bg-card border border-border/40 p-6 md:p-8 rounded-2xl mt-8">
            <h3 className="text-base font-bold text-foreground mb-3">
              5. Questions or Modifications
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Since our code is purely open source, you have full freedom to fork the repository, modify the styles, implement your own proxies, and launch your own customized iterations. If you have licensing questions, feel free to inspect our code or reach out:
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
            >
              Contact Legal & Dev Team
            </Link>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
