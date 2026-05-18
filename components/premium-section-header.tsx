import { ReactNode } from 'react';

interface PremiumSectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: ReactNode;
  showUnderline?: boolean;
  animated?: boolean;
}

export function PremiumSectionHeader({
  title,
  subtitle,
  accent,
  showUnderline = true,
  animated = true,
}: PremiumSectionHeaderProps) {
  return (
    <div className={animated ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}>
      <div className="relative mb-12">
        {/* Main Title */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="section-heading text-foreground text-4xl md:text-5xl font-bold font-display">
            {title}
          </h2>
          {accent && (
            <span className="text-accent text-4xl md:text-5xl font-bold font-display">
              {accent}
            </span>
          )}
        </div>

        {/* Animated Underline */}
        {showUnderline && (
          <div className="mt-4 flex gap-2">
            <div className="h-1.5 w-12 bg-gradient-to-r from-accent to-accent/70 rounded-full" />
            <div className="h-1.5 w-8 bg-gradient-to-r from-accent/50 to-accent/20 rounded-full" />
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-foreground/70 text-lg font-light mt-4 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
