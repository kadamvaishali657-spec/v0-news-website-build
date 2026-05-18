'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface GlobeSelectorProps {
  articles: any[];
  onLocationSelect: (region: string) => void;
}

const REGIONS = [
  { name: 'North America', lat: 45, lon: -100, label: '🇺🇸 USA', articles: 24 },
  { name: 'Europe', lat: 50, lon: 15, label: '🇪🇺 Europe', articles: 18 },
  { name: 'Asia Pacific', lat: 20, lon: 100, label: '🌏 Asia', articles: 31 },
  { name: 'India', lat: 20, lon: 77, label: '🇮🇳 India', articles: 15 },
  { name: 'Middle East', lat: 25, lon: 55, label: '🌍 Middle East', articles: 12 },
  { name: 'South America', lat: -10, lon: -55, label: '🇧🇷 S. America', articles: 9 },
  { name: 'Africa', lat: 0, lon: 25, label: '🌍 Africa', articles: 8 },
];

export function GlobeSelector({ articles, onLocationSelect }: GlobeSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setIsZooming(true);
    setTimeout(() => {
      onLocationSelect(region);
      setIsZooming(false);
    }, 2000);
  };

  if (!selectedRegion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background flex items-center justify-center px-6 py-12">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 font-bold">
              Explore Global <span className="text-accent">News</span>
            </h1>
            <p className="text-lg text-foreground/70 font-light tracking-wide">
              Select a region to discover breaking stories from around the world
            </p>
          </div>

          {/* Globe Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Interactive Globe SVG */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Globe Base */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full animate-rotate-slow"
                  style={{
                    filter: 'drop-shadow(0 20px 60px rgba(255, 127, 64, 0.3))',
                  }}
                >
                  {/* Earth */}
                  <defs>
                    <radialGradient id="earthGradient" cx="35%" cy="35%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
                    </radialGradient>
                  </defs>

                  {/* Base sphere */}
                  <circle cx="200" cy="200" r="180" fill="url(#earthGradient)" stroke="rgba(255, 127, 64, 0.2)" strokeWidth="2" />

                  {/* Continents simplified */}
                  <path
                    d="M 200 80 L 240 100 L 250 140 L 220 160 L 200 150 Z"
                    fill="rgba(100, 150, 100, 0.4)"
                  />
                  <path
                    d="M 120 160 L 160 140 L 180 180 L 140 190 Z"
                    fill="rgba(100, 150, 100, 0.4)"
                  />
                  <path
                    d="M 260 200 L 310 180 L 320 240 L 280 250 Z"
                    fill="rgba(100, 150, 100, 0.4)"
                  />
                  <path
                    d="M 140 280 L 190 260 L 210 310 L 160 320 Z"
                    fill="rgba(100, 150, 100, 0.4)"
                  />

                  {/* Region Markers */}
                  {REGIONS.map((region, idx) => {
                    const angle = (region.lon + 180) * (Math.PI / 180);
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const vertAngle = (region.lat) * (Math.PI / 180);
                    const distance = 180 * Math.cos(vertAngle);
                    const x = 200 + distance * cos;
                    const y = 200 + distance * sin;

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          fill={selectedRegion === region.name ? 'rgba(255, 127, 64, 1)' : 'rgba(255, 127, 64, 0.6)'}
                          stroke="white"
                          strokeWidth="2"
                          className="transition-all duration-300 cursor-pointer hover:r-16"
                          style={{
                            cursor: 'pointer',
                            filter: selectedRegion === region.name ? 'drop-shadow(0 0 20px rgba(255, 127, 64, 1))' : 'none',
                          }}
                          onClick={() => handleRegionSelect(region.name)}
                        />
                        <text
                          x={x}
                          y={y + 30}
                          textAnchor="middle"
                          fontSize="12"
                          fill="rgba(255, 255, 255, 0.8)"
                          className="pointer-events-none"
                        >
                          {region.articles}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Rotating orbit */}
                <div className="absolute inset-0 border border-accent/20 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
              </div>
            </div>

            {/* Region List */}
            <div className="space-y-3">
              <p className="text-sm font-display uppercase tracking-widest text-accent mb-4">Available Regions</p>
              <div className="space-y-2">
                {REGIONS.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => handleRegionSelect(region.name)}
                    className={`w-full p-4 text-left transition-all duration-300 border rounded-lg font-medium ${
                      selectedRegion === region.name
                        ? 'bg-accent text-foreground border-accent shadow-lg shadow-accent/50 scale-105'
                        : 'bg-card border-border hover:border-accent hover:bg-accent/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg">{region.label}</p>
                        <p className="text-sm opacity-75">{region.articles} articles</p>
                      </div>
                      <div className="text-xl">→</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Zoom & Loading State
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-background" />

      {/* Zooming Globe */}
      <div
        className="relative w-96 h-96 animate-pulse"
        style={{
          animation: isZooming ? 'zoom-in-globe 2s ease-out forwards' : 'none',
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 20px 100px rgba(255, 127, 64, 0.5))' }}>
          <defs>
            <radialGradient id="earthGradientZoom" cx="35%" cy="35%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="180" fill="url(#earthGradientZoom)" stroke="rgba(255, 127, 64, 0.4)" strokeWidth="3" />
        </svg>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-1/4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
        <p className="font-display text-foreground text-xl">
          Loading {selectedRegion || 'news'}...
        </p>
      </div>

      <style>{`
        @keyframes zoom-in-globe {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(30);
            opacity: 0;
          }
        }
        
        @keyframes rotate-slow {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  );
}
