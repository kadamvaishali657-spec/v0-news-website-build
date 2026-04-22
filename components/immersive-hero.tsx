'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-background flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/2 via-accent/5 to-foreground/2" />
      
      {/* Animated Grid Pattern with Parallax */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full absolute inset-0" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <defs>
            <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Floating Accent Orbs */}
      <div 
        className="absolute top-20 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y * 0.5}px)` }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y}px)` }}
      />

      {/* Animated Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full opacity-60 animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-accent rounded-full opacity-30 animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div 
          className="immersive-transition max-w-5xl"
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
        >
          {/* Animated Badge - Premium */}
          <div className="inline-flex items-center justify-center mb-8 px-4 py-2.5 border border-accent/50 rounded-full text-xs font-display text-accent tracking-widest uppercase bg-gradient-to-r from-accent/10 to-accent/5 backdrop-blur-md hover:border-accent/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg shadow-accent/10">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2" />
            Next Generation Intelligence
          </div>

          {/* Main Heading - Advanced Animation */}
          <h1 className="hero-text text-foreground mb-8 leading-[1.1] text-6xl md:text-8xl font-display font-bold">
            <span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100" style={{ animationDelay: '0.1s' }}>Global</span>
            <span className="block relative inline-block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200" style={{ animationDelay: '0.2s' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-accent/60 animate-pulse-subtle">Intelligence</span>
              <span className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent/80 to-transparent blur-lg rounded-full animate-glow" />
            </span>
          </h1>
          
          {/* Subheading - Enhanced Typography */}
          <p className="text-lg md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto font-light tracking-wide leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.3s' }}>
            Immersive news experience with AI insights, real-time updates, and interactive storytelling
          </p>

          {/* Stats Section - New */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.35s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">Live Updates</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">1000+</div>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">Global Sources</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">AI</div>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">Powered</p>
            </div>
          </div>

          {/* CTA Buttons - Premium Design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.4s' }}>
            <button className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-accent to-accent/80 text-foreground font-display text-sm font-bold tracking-widest uppercase hover:shadow-2xl shadow-lg shadow-accent/30 transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden">
              <span className="relative z-10">Explore Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
            <button className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-accent/50 text-accent font-display text-sm font-bold tracking-widest uppercase hover:bg-accent/10 hover:border-accent transition-all duration-300 transform hover:scale-110 active:scale-95">
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator - Animated */}
        <div 
          className="absolute bottom-12 transition-all duration-500"
          style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs text-foreground/60 font-display uppercase tracking-widest">Scroll to Explore</span>
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
