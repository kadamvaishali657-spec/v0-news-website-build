'use client';

import Link from 'next/link';
import { Home, Search, Bookmark, Cog, Mail, Edit3, Shield } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
      <div className="flex items-center justify-around">
        <Link 
          href="/" 
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link 
          href="/search"
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link 
          href="/saved" 
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Saved"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">Saved</span>
        </Link>
        <Link 
          href="/newsletter" 
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Newsletter"
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium">Mail</span>
        </Link>
        <Link
          href="/publish"
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Publish"
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pub</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Settings"
        >
          <Cog className="w-5 h-5" />
          <span className="text-[10px] font-medium">Set</span>
        </Link>
        <Link 
          href="/admin" 
          className="flex flex-col items-center gap-1 px-2 py-3 text-muted-foreground hover:text-accent transition-colors"
          title="Admin"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      </div>
    </nav>
  );
}
