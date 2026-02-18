'use client';

import Link from 'next/link';
import { ChevronRight, Bookmark, TrendingUp, Radio } from 'lucide-react';

interface SidebarNavProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const categories = [
  { name: 'Global News', icon: '🌍' },
  { name: 'Tech & Innovation', icon: '💻' },
  { name: 'Business & Finance', icon: '💼' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Entertainment & Culture', icon: '🎬' },
  { name: 'Learning & Education', icon: '📚' },
  { name: 'Social Media Digest', icon: '📱' },
  { name: 'Random Interesting', icon: '🎲' },
];

export function SidebarNav({ selectedCategory, onCategorySelect }: SidebarNavProps) {
  return (
    <aside className="hidden lg:block w-64 space-y-6">
      {/* Quick Access */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-bold text-foreground mb-3 text-sm uppercase text-muted-foreground">Quick Access</h3>
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent/10 transition-colors text-sm">
            <Radio className="w-4 h-4 text-accent" />
            Latest News
          </Link>
          <Link href="/#trending" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent/10 transition-colors text-sm">
            <TrendingUp className="w-4 h-4 text-accent" />
            Trending
          </Link>
          <Link href="/#saved" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent/10 transition-colors text-sm">
            <Bookmark className="w-4 h-4 text-accent" />
            Saved Articles
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-bold text-foreground mb-3 text-sm uppercase text-muted-foreground">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategorySelect?.(category.name)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 group ${
                selectedCategory === category.name
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-foreground hover:bg-accent/10'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1 truncate">{category.name}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-4">
        <h3 className="font-bold text-foreground mb-3 text-sm">Today's Stats</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>News Sources</span>
            <span className="text-foreground font-medium">25+</span>
          </div>
          <div className="flex justify-between">
            <span>Articles Updated</span>
            <span className="text-foreground font-medium">Every 30min</span>
          </div>
          <div className="flex justify-between">
            <span>Coverage</span>
            <span className="text-foreground font-medium">Global</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
