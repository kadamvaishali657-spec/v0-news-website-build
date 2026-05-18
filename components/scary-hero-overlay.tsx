'use client';

import { useEffect, useState } from 'react';

export function ScaryHeroOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [glitchFrame, setGlitchFrame] = useState(0);

  useEffect(() => {
    // Glitch animation frames
    const interval = setInterval(() => {
      setGlitchFrame(prev => (prev + 1) % 6);
    }, 100);

    // Fade out overlay after 2 seconds
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main dark overlay with fade out */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{
          opacity: showOverlay ? 0.7 : 0,
        }}
      />

      {/* Scanning lines effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(220, 38, 38, 0.15) 0px, rgba(220, 38, 38, 0.15) 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 4px',
            animation: showOverlay ? 'scan-lines 0.2s linear infinite' : 'none',
          }}
        />
      </div>

      {/* Glitch text - "LOADING REALITY" */}
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative text-center">
            {/* Primary text */}
            <div className="text-6xl font-display font-black text-red-600 tracking-widest select-none">
              INFORMED
            </div>
            
            {/* Glitch layers */}
            {glitchFrame > 0 && (
              <>
                <div 
                  className="absolute top-0 left-0 text-6xl font-display font-black text-cyan-500 tracking-widest mix-blend-screen"
                  style={{
                    transform: `translateX(${Math.random() * 8 - 4}px) translateY(${Math.random() * 8 - 4}px)`,
                    opacity: 0.7,
                  }}
                >
                  INFORMED
                </div>
                <div 
                  className="absolute top-0 left-0 text-6xl font-display font-black text-red-900 tracking-widest mix-blend-multiply"
                  style={{
                    transform: `translateX(${Math.random() * 8 - 4}px) translateY(${Math.random() * 8 - 4}px)`,
                    opacity: 0.5,
                  }}
                >
                  INFORMED
                </div>
              </>
            )}

            {/* Status text */}
            <div className="mt-8 text-sm font-display tracking-widest text-red-400 animate-pulse">
              // LOADING REALITY...
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan-lines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  );
}
