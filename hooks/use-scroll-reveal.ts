'use client';

import { useEffect, useRef, useState } from 'react';

export interface ScrollRevealConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollReveal(config: ScrollRevealConfig = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = config;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return {
    ref,
    isVisible,
  };
}

// Higher-order component for scroll reveal
export function withScrollReveal<P extends object>(
  Component: React.ComponentType<P>,
  config?: ScrollRevealConfig
) {
  return function ScrollRevealComponent(props: P) {
    const { ref, isVisible } = useScrollReveal(config);

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-700 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <Component {...props} />
      </div>
    );
  };
}
