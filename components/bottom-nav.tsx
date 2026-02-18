'use client';

import Link from 'next/link';
import { Home, Search, Bookmark, Settings } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
      <div className="flex items-center justify-around">
        <Link 
          href="/" 
          className="flex flex-col items-center gap-1 px-4 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Home"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link 
          href="/#search" 
          className="flex flex-col items-center gap-1 px-4 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Search"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Search</span>
        </Link>
        <Link 
          href="/#saved" 
          className="flex flex-col items-center gap-1 px-4 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Saved"
        >
          <Bookmark className="w-6 h-6" />
          <span className="text-xs font-medium">Saved</span>
        </Link>
        <Link 
          href="/admin" 
          className="flex flex-col items-center gap-1 px-4 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Admin"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Admin</span>
        </Link>
      </div>
    </nav>
  );
}
