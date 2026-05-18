'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowLeft, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to News Desk
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or custom feed integration requests? Drop us a line and let’s connect.
            </p>
          </div>
        </section>

        {/* Contact Form and Details Grid */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info Panel */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Channels</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are always looking to collaborate, improve the RSS feed parser engine, and add smart custom sources. Let us know what features or outlets you would like to see!
                </p>
              </div>

              {/* Direct Info Cards */}
              <div className="space-y-4">
                
                {/* Email Card */}
                <div className="bg-card border border-border/40 p-5 rounded-2xl flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Direct Support</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Send us a direct inquiry anytime.</p>
                    <a href="mailto:workwithme785@gmail.com" className="text-sm text-primary font-medium hover:underline mt-1.5 block">
                      workwithme785@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-card border border-border/40 p-5 rounded-2xl flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Office Headquarters</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Distributed team, remote first.</p>
                    <span className="text-sm text-foreground font-medium mt-1.5 block">
                      Silicon Valley, CA &bull; Remote Global
                    </span>
                  </div>
                </div>

                {/* Web Card */}
                <div className="bg-card border border-border/40 p-5 rounded-2xl flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 flex-shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Online Community</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Read our guides, setup parameters, and issues.</p>
                    <Link href="https://github.com/kadamvaishali657-spec/v0-news-website-build" target="_blank" className="text-sm text-primary font-medium hover:underline mt-1.5 block">
                      github.com/v0-news-website-build
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form Panel */}
            <div className="lg:col-span-7 bg-card border border-border/60 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Send Message</h3>
              </div>

              {status === 'success' ? (
                <div className="py-12 text-center space-y-4 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Message Dispatched!</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                      Thank you for reaching out. We have logged your request and our editorial team will get back to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5 animate-slide-down">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Validation Error:</strong> Please fill in all the required fields (Name, Email, and Message) before submitting.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Email <span className="text-destructive">*</span></label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Feedback, Support, or Feature Request"
                      className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Message <span className="text-destructive">*</span></label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
