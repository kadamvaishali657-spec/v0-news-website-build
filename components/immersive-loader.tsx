'use client';

import { useEffect, useState } from 'react';

export function ImmersiveLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate realistic loading progress
    const intervals: NodeJS.Timeout[] = [];
    
    const progressStages = [
      { target: 25, duration: 400 },
      { target: 50, duration: 600 },
      { target: 75, duration: 800 },
      { target: 90, duration: 1000 },
      { target: 95, duration: 300 },
    ];

    progressStages.forEach((stage, idx) => {
      const timeout = setTimeout(() => {
        setProgress(stage.target);
      }, idx === 0 ? 100 : progressStages[idx - 1].duration + (idx * 200));
      intervals.push(timeout as any);
    });

    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/98 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - Theme aware */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/25 rounded-full blur-3xl animate-pulse opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse opacity-35" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse opacity-25" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md px-6">
        {/* Animated Logo/Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            INFORMED
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            <p className="text-foreground/60 text-sm uppercase tracking-widest font-medium">Loading Intelligence</p>
            <div className="h-1 w-8 bg-gradient-to-l from-accent to-accent/50 rounded-full" />
          </div>
        </div>

        {/* Animated Particles */}
        <div className="mb-12 h-32 flex items-center justify-center">
          <div className="relative w-24 h-24">
            {/* Central rotating element */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" style={{ animationDuration: '3s' }} />
            
            {/* Secondary rotation */}
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent/50 border-l-accent/50 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent/70 rounded-full animate-pulse" />
            </div>

            {/* Orbiting particles */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent/70 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  animation: `orbit 4s linear infinite`,
                  animationDelay: `${i * 1.3}s`,
                  transformOrigin: '0 0',
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="relative h-2 bg-foreground/15 rounded-full overflow-hidden backdrop-blur-sm border border-foreground/10">
            <div
              className="h-full bg-gradient-to-r from-accent via-accent/90 to-accent rounded-full transition-all duration-300 ease-out shadow-lg shadow-accent/60"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-foreground/60 uppercase tracking-widest font-medium">
              {progress < 25 ? 'Initializing...' : progress < 50 ? 'Fetching News...' : progress < 75 ? 'Processing...' : 'Finalizing...'}
            </p>
            <p className="text-xs text-accent font-bold">{progress}%</p>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="mt-12 text-foreground/50 text-sm space-y-2">
          <p className="animate-pulse">Gathering global intelligence</p>
          <p className="text-xs opacity-60">Powered by advanced news aggregation</p>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
