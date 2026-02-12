'use client';

const CATEGORIES = ['All', 'AI', 'Gadgets', 'Startups', 'Cybersecurity'];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
            selectedCategory === category
              ? 'bg-accent text-accent-foreground'
              : 'border border-border text-foreground hover:border-accent hover:text-accent'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
