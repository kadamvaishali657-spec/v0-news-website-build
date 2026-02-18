'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Loader2, Upload } from 'lucide-react';

const CATEGORIES = [
  'Global News',
  'Tech & Innovation',
  'Business & Finance',
  'Sports',
  'Entertainment & Culture',
  'Learning & Education',
];

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !content || !category || !authorName || !authorEmail) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    try {
      // Get existing articles from localStorage
      const savedArticles = localStorage.getItem('user-published-articles');
      const articles = savedArticles ? JSON.parse(savedArticles) : [];
      
      const newArticle = {
        id: `user-${Date.now()}-${Math.random()}`,
        title,
        description,
        content,
        category,
        image: imageUrl,
        source: authorName,
        link: '#',
        pubDate: new Date(),
        author: {
          name: authorName,
          email: authorEmail,
        },
      };
      
      articles.push(newArticle);
      localStorage.setItem('user-published-articles', JSON.stringify(articles));
      
      setMessage({ type: 'success', text: 'Article published successfully!' });
      
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('');
      setImageUrl('');
      setAuthorName('');
      setAuthorEmail('');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to publish article. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Publish Your Article</h1>
          <p className="text-muted-foreground">Share your thoughts and ideas with our community</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Article Title *
            </label>
            <Input
              placeholder="Enter your article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/200</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (Summary) *
            </label>
            <Textarea
              placeholder="Brief description of your article (appears in news feed)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">{description.length}/300</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Article Content *
            </label>
            <Textarea
              placeholder="Write your complete article here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minLength={100}
              rows={10}
              className="w-full font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Min. 100 characters required</p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image URL
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Optional - provide a valid image URL</p>
          </div>

          {/* Author Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name *
              </label>
              <Input
                placeholder="Your full name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Email *
              </label>
              <Input
                placeholder="your.email@example.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                type="email"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Article
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setTitle('');
                setDescription('');
                setContent('');
                setCategory('');
                setImageUrl('');
                setAuthorName('');
                setAuthorEmail('');
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6">
          <h3 className="font-bold text-foreground mb-2">Publication Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Keep titles clear and informative</li>
            <li>✓ Descriptions should summarize the article in 1-2 sentences</li>
            <li>✓ Original content is encouraged</li>
            <li>✓ Minimum 100 characters for article content</li>
            <li>✓ All fields marked with * are required</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
