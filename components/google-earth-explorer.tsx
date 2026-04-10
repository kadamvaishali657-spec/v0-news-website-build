'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Region {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

const REGIONS: Region[] = [
  { name: 'North America', lat: 45.0, lng: -100.0, zoom: 3 },
  { name: 'Europe', lat: 50.0, lng: 15.0, zoom: 3 },
  { name: 'Asia', lat: 34.0, lng: 100.0, zoom: 3 },
  { name: 'India', lat: 20.5, lng: 78.9, zoom: 4 },
  { name: 'Middle East', lat: 25.0, lng: 50.0, zoom: 4 },
  { name: 'South America', lat: -15.0, lng: -55.0, zoom: 3 },
  { name: 'Africa', lat: 0.0, lng: 20.0, zoom: 3 },
];

export function GoogleEarthExplorer() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZRWbVfqB5cVwHe8iFqxI5DkRjOvF4X1w&libraries=maps`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    mapRef.current = new (window as any).google.maps.Map(mapContainerRef.current, {
      zoom: 2,
      center: { lat: 20, lng: 0 },
      mapTypeId: 'satellite',
      styles: [
        { elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#FF7F40' }] },
      ],
    });
  };

  const handleRegionSelect = async (region: Region) => {
    setIsLoading(true);
    setSelectedRegion(region);

    // Animate zoom to region
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.setZoom(region.zoom);
        mapRef.current.panTo({ lat: region.lat, lng: region.lng });
      }, 300);
    }

    // Simulate loading content
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
      {selectedRegion && !isLoading ? (
        // Content View
        <div className="w-full h-full flex flex-col">
          {/* Header with Back Button */}
          <div className="bg-gradient-to-r from-accent to-accent/80 text-foreground px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={() => setSelectedRegion(null)}
              className="flex items-center gap-2 hover:bg-accent/80 px-4 py-2 rounded transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Globe
            </button>
            <h2 className="font-display text-2xl font-bold">{selectedRegion.name}</h2>
            <div className="w-24" />
          </div>

          {/* Map View */}
          <div className="flex-1 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      ) : (
        // Globe Selection View
        <div className="max-w-6xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-16">
            <h1 className="hero-text text-foreground mb-4">Explore News by Region</h1>
            <p className="text-lg text-foreground/70 font-light">
              Click on a region to explore news from around the world
            </p>
          </div>

          {/* Region Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {REGIONS.map((region) => (
              <button
                key={region.name}
                onClick={() => handleRegionSelect(region)}
                className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border p-6 rounded-lg hover:border-accent transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-accent group-hover:scale-125 transition-transform duration-300" />
                </div>
                <h3 className="font-display font-bold text-foreground text-center">
                  {region.name}
                </h3>
              </button>
            ))}
          </div>

          {/* World Map Preview */}
          <div className="relative h-96 bg-gradient-to-b from-blue-200 to-blue-100 rounded-lg overflow-hidden border-2 border-accent/30 shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-accent animate-spin" />
          </div>
          <p className="text-foreground font-display text-lg tracking-wide">
            Zooming to {selectedRegion?.name}
          </p>
        </div>
      )}
    </div>
  );
}
