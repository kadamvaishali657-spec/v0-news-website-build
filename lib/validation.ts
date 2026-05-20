import { z } from 'zod';

// Validation schemas for app
export const FeedUrlSchema = z.string().url('Must be a valid URL').min(5);

export const RSSFeedSchema = z.object({
  url: FeedUrlSchema,
  title: z.string().min(1, 'Title required').max(100, 'Title too long'),
  category: z.string().optional(),
});

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  link: z.string().url(),
  pubDate: z.instanceof(Date),
  image: z.string().url().optional(),
  source: z.string(),
  category: z.string().optional(),
});

export const SearchQuerySchema = z
  .string()
  .max(200, 'Search query too long')
  .refine(
    (q) => q.trim().length === 0 || q.trim().length >= 2,
    'Search must be at least 2 characters'
  );

export const CategorySchema = z.enum([
  'All',
  'Technology',
  'Business',
  'Science',
  'Sports',
  'Entertainment',
  'Health',
  'World',
]);

// Type exports
export type RSSFeed = z.infer<typeof RSSFeedSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Category = z.infer<typeof CategorySchema>;
