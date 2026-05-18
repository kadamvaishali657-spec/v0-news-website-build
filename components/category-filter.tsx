'use client';

import { Globe, Cpu, TrendingUp, Gamepad2, Sparkles, GraduationCap, MessageSquare, Zap, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Global News', icon: Globe },
  { name: 'Tech & Innovation', icon: Cpu },
  { name: 'Business & Finance', icon: TrendingUp },
  { name: 'Sports', icon: Gamepad2 },
  { name: 'Entertainment & Culture', icon: Sparkles },
  { name: 'Learning & Education', icon: GraduationCap },
  { name: 'Social Media Digest', icon: MessageSquare },
  { name: 'Random Interesting', icon: Zap },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => onCategoryChange(name)}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm whitespace-nowrap ${
            selectedCategory === name
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-sm'
          }`}
        >
          <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
            selectedCategory === name ? 'text-white/90' : 'text-primary/50'
          }`} />
          {name}
        </button>
      ))}
    </div>
  );
}
