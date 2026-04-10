'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground" />
      
      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsla(0,0%,100%,.1)_1px,transparent_1px),linear-gradient(hsla(0,0%,100%,.1)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div 
          className="immersive-transition"
          style={{ transform: `translateY(${scrollY * 0.5}px)`, opacity: Math.max(0, 1 - scrollY / 800) }}
        >
          {/* Main Heading */}
          <h1 className="hero-text text-background mb-6">
            INFORM<span className="text-accent">ED</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-background/80 mb-12 max-w-2xl mx-auto font-light tracking-wide">
            Discover news stories that reshape your perspective
          </p>

          {/* CTA Button */}
          <button className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-display text-lg hover:scale-105 transition-transform duration-300">
            Explore Stories
            <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <ChevronDown className="w-6 h-6 text-background/50" />
        </div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
