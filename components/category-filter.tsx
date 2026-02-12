'use client';

const CATEGORIES = [
  'All',
  'Global News',
  'Tech & Innovation',
  'Business & Finance',
  'Sports',
  'Entertainment & Culture',
  'Learning & Education',
  'Social Media Digest',
  'Random Interesting',
];

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
          className={`px-4 py-2 rounded-full font-medium transition-all text-sm whitespace-nowrap ${
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
