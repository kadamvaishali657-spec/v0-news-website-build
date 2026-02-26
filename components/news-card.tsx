'use client';

import { Article } from '@/lib/rss-parser';
import { ExternalLink, Calendar, Bookmark, Share2, Clock, ArrowUpRight, Twitter, Linkedin, MessageCircle, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('saved-articles');
    return saved ? JSON.parse(saved).some((a: Article) => a.id === article.id) : false;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = mounted
    ? formatRelativeTime(article.pubDate)
    : new Date(article.pubDate).toLocaleDateString();

  // Estimate reading time (average 200 words per minute)
  const wordCount = (article.title + ' ' + article.description).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const handleSave = () => {
    let saved = localStorage.getItem('saved-articles');
    let articles = saved ? JSON.parse(saved) : [];
    
    if (!isSaved) {
      articles.push(article);
      setIsSaved(true);
      toast({
        title: "Article saved",
        description: "You can find your saved articles in the 'Saved' section.",
      });
    } else {
      articles = articles.filter((a: Article) => a.id !== article.id);
      setIsSaved(false);
      toast({
        title: "Article removed",
        description: "The article has been removed from your saved list.",
      });
    }
    
    localStorage.setItem('saved-articles', JSON.stringify(articles));
  };

  const handleShare = (platform: string) => {
    const text = `Check out: ${article.title}`;
    const url = article.link;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.link);
    toast({
      title: "Link copied",
      description: "The article link has been copied to your clipboard.",
    });
  };

  return (
    <article className="group h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      {article.image && !imageError && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Source & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
            {article.source}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min read
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground line-clamp-3 group-hover:text-accent transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            asChild
            className="flex-1"
          >
            <Link href={`/article/${encodeURIComponent(article.id)}`}>
              Read Article
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            variant={isSaved ? "default" : "secondary"}
            size="icon"
            onClick={handleSave}
            aria-label={isSaved ? "Remove from saved" : "Save article"}
            title={isSaved ? "Remove from saved" : "Save article"}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Share article"
                title="Share article"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                <Linkedin className="w-4 h-4 mr-2" />
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
