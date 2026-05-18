'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

interface SubscriptionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function SubscriptionButton({
  variant = 'primary',
  size = 'md',
  text = 'Subscribe with Google News',
  className = '',
}: SubscriptionButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = () => {
    if (typeof window !== 'undefined' && (window as any).SWG_BASIC) {
      (window as any).SWG_BASIC.forEach((basicSubscriptions: any) => {
        basicSubscriptions.showSubscriptionOption?.();
      });
    }
  };

  if (!mounted) return null;

  const baseStyles = 'flex items-center gap-2 font-semibold transition-all duration-300 rounded-lg';

  const variantStyles = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg hover:scale-105',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-accent text-accent hover:bg-accent/10',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={handleSubscribe}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      title="Subscribe to INFORMED via Google News"
    >
      <Lock className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      {text}
    </button>
  );
}
