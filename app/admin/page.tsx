'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { RSSFeed, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Plus, Trash2, Save, Eye, EyeOff, RefreshCw, X, Sliders, Rss, ShieldAlert, Check } from 'lucide-react';

export default function AdminPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedTitle, setNewFeedTitle] = useState('');
  const [newFeedCategory, setNewFeedCategory] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [disabledFeeds, setDisabledFeeds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load feeds and disabled feeds from localStorage
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rss-feeds');
    const savedDisabled = localStorage.getItem('disabled-feeds');
    
    if (savedFeeds) {
      try {
        const parsed = JSON.parse(savedFeeds);
        setFeeds(parsed);
      } catch (e) {
        console.error('Error loading feeds:', e);
      }
    }
    
    if (savedDisabled) {
      try {
        const parsed = JSON.parse(savedDisabled);
        setDisabledFeeds(parsed);
      } catch (e) {
        console.error('Error loading disabled feeds:', e);
      }
    }
  }, []);

  const saveFeedsToStorage = (updatedFeeds: RSSFeed[]) => {
    localStorage.setItem('rss-feeds', JSON.stringify(updatedFeeds));
    sessionStorage.removeItem('articles-session-cache'); // Clear cache when feeds change
  };

  const saveDisabledToStorage = (disabled: string[]) => {
    localStorage.setItem('disabled-feeds', JSON.stringify(disabled));
    sessionStorage.removeItem('articles-session-cache'); // Clear cache when feeds change
  };

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeedUrl.trim() || !newFeedTitle.trim()) {
      setMessage({ type: 'error', text: 'Please fill in URL and title' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Validate URL
    try {
      new URL(newFeedUrl);
    } catch {
      setMessage({ type: 'error', text: 'Please enter a valid URL' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Check for duplicates
    if (feeds.some((f) => f.url === newFeedUrl)) {
      setMessage({ type: 'error', text: 'This feed URL already exists' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newFeed: RSSFeed = { 
      url: newFeedUrl, 
      title: newFeedTitle,
      category: newFeedCategory || undefined
    };
    
    const updatedFeeds = [...feeds, newFeed];
    setFeeds(updatedFeeds);
    saveFeedsToStorage(updatedFeeds);

    setNewFeedUrl('');
    setNewFeedTitle('');
    setNewFeedCategory('');
    setShowAddForm(false);
    setMessage({ type: 'success', text: 'Feed added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemoveFeed = (url: string) => {
    if (confirm('Are you sure you want to remove this feed?')) {
      const updatedFeeds = feeds.filter((f) => f.url !== url);
      setFeeds(updatedFeeds);
      saveFeedsToStorage(updatedFeeds);
      
      // Also remove from disabled list
      const updated = disabledFeeds.filter(u => u !== url);
      setDisabledFeeds(updated);
      saveDisabledToStorage(updated);
      
      setMessage({ type: 'success', text: 'Feed removed successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleFeed = (url: string) => {
    const updated = disabledFeeds.includes(url)
      ? disabledFeeds.filter(u => u !== url)
      : [...disabledFeeds, url];
    
    setDisabledFeeds(updated);
    saveDisabledToStorage(updated);
    
    const isDisabling = updated.includes(url);
    setMessage({ 
      type: 'success', 
      text: `Feed ${isDisabling ? 'disabled' : 'enabled'}!` 
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default feeds? This will remove all custom feeds and enable all defaults.')) {
      setFeeds(DEFAULT_FEEDS);
      setDisabledFeeds([]);
      saveFeedsToStorage(DEFAULT_FEEDS);
      saveDisabledToStorage([]);
      setMessage({ type: 'success', text: 'Reset to default feeds' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const activeFeedsCount = feeds.length - disabledFeeds.length;

  return (
body {
  font-family: 'Merriweather', serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .font-display {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
  }
}

@layer base {
  :root {
    /* Unified Light Theme */
    --background: 220 20% 97%;
    --foreground: 224 30% 12%;

    --card: 0 0% 100%;
    --card-foreground: 224 30% 12%;

    --popover: 0 0% 100%;
    --popover-foreground: 224 30% 12%;

    --primary: 245 82% 60%;
    --primary-foreground: 0 0% 100%;

    --secondary: 220 14% 94%;
    --secondary-foreground: 224 30% 12%;

    --muted: 220 14% 94%;
    --muted-foreground: 220 10% 46%;

    --accent: 25 95% 55%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 14% 90%;
    --input: 220 14% 90%;
    --ring: 245 82% 60%;

    --chart-1: 245 82% 60%;
    --chart-2: 330 80% 60%;
    --chart-3: 170 75% 45%;
    --chart-4: 35 92% 55%;
    --chart-5: 280 70% 60%;

    --radius: 0.75rem;

    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 224 30% 12%;
    --sidebar-primary: 245 82% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 94%;
    --sidebar-accent-foreground: 224 30% 12%;
    --sidebar-border: 220 14% 90%;
    --sidebar-ring: 245 82% 60%;
  }

  .dark {
    /* Unified Dark Theme */
    --background: 240 10% 4%;
    --foreground: 0 0% 98%;

    --card: 240 10% 6%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 6%;
    --popover-foreground: 0 0% 98%;

    --primary: 250 89% 65%;
    --primary-foreground: 0 0% 100%;

    --secondary: 240 10% 12%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 10% 12%;
    --muted-foreground: 240 5% 65%;

    --accent: 25 95% 58%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 240 10% 15%;
    --input: 240 10% 15%;
    --ring: 250 89% 65%;

    --chart-1: 250 89% 65%;
    --chart-2: 330 80% 65%;
    --chart-3: 170 75% 50%;
    --chart-4: 35 92% 60%;
    --chart-5: 280 70% 65%;

    --sidebar-background: 240 10% 4%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 250 89% 65%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 10% 12%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 240 10% 15%;
    --sidebar-ring: 250 89% 65%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground transition-colors duration-200;
  }
}

/* Components */
@layer components {
  .immersive-transition {
    @apply transition-all duration-700 ease-out;
  }

  .hero-text {
    @apply font-display leading-tight tracking-tighter;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 900;
    line-height: 1.1;
  }

  .section-heading {
    @apply font-display tracking-tight;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .article-hover {
    @apply cursor-pointer transition-all duration-500;
  }

  .article-hover:hover {
    transform: translateY(-8px);
  }

  .overlay-gradient {
    @apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent;
  }

  .glass {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }

  .dark .glass {
    background: rgba(15, 18, 35, 0.72);
  }

  .gradient-text {
    background: linear-gradient(
      135deg,
      #6366f1 0%,
      #8b5cf6 25%,
      #a855f7 50%,
      #ec4899 75%,
      #f43f5e 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-border {
    position: relative;
    border-radius: var(--radius);
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1.5px;
    background: linear-gradient(
      135deg,
      #6366f1,
      #8b5cf6,
      #a855f7,
      #ec4899
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .gradient-border:hover::before {
    opacity: 1;
  }

  .card-hover {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow:
      0 20px 60px -15px rgba(99, 102, 241, 0.2),
      0 10px 20px -10px rgba(0, 0, 0, 0.08);
  }

  .mesh-gradient {
    background-image:
      radial-gradient(
        at 20% 80%,
        rgba(99, 102, 241, 0.15) 0px,
        transparent 50%
      ),
      radial-gradient(
        at 80% 20%,
        rgba(139, 92, 246, 0.12) 0px,
        transparent 50%
      ),
      radial-gradient(
        at 40% 40%,
        rgba(168, 85, 247, 0.08) 0px,
        transparent 50%
      ),
      radial-gradient(
        at 70% 70%,
        rgba(236, 72, 153, 0.1) 0px,
        transparent 50%
      );
  }
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  33% {
    transform: translateY(-10px) rotate(2deg);
  }

  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.5);
  }
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* Utilities */
@layer utilities {
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-in {
    animation: fade-in 0.5s ease-out;
  }

  .fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .pulse-dot {
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .ticker {
    animation: ticker 30s linear infinite;
  }

  .ticker:hover {
    animation-play-state: paused;
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(99, 102, 241, 0.08) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s ease-in-out infinite;
  }

  .stagger-children > * {
    opacity: 0;
    animation: fade-in-up 0.5s ease-out forwards;
  }

  .stagger-children > *:nth-child(1) {
    animation-delay: 0.05s;
  }

  .stagger-children > *:nth-child(2) {
    animation-delay: 0.1s;
  }

  .stagger-children > *:nth-child(3) {
    animation-delay: 0.15s;
  }

  .stagger-children > *:nth-child(4) {
    animation-delay: 0.2s;
  }

  .stagger-children > *:nth-child(5) {
    animation-delay: 0.25s;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* Selection */
::selection {
  background: rgba(99, 102, 241, 0.2);
  color: inherit;
}

/* Focus */
*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
