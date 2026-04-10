'use client';

import { Header } from '@/components/header';
import { GoogleEarthExplorer } from '@/components/google-earth-explorer';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GoogleEarthExplorer />
    </div>
  );
}
