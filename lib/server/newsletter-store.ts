/**
 * File-based newsletter subscriber storage.
 * Persists subscribers to a JSON file on disk.
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface Subscriber {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  categories: string[];
  subscribedAt: string;
  active: boolean;
  confirmedAt?: string;
  unsubscribedAt?: string;
}

interface NewsletterStore {
  subscribers: Subscriber[];
  stats: {
    totalSubscriptions: number;
    totalUnsubscriptions: number;
    lastUpdated: string;
  };
}

const STORE_PATH = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(STORE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readStore(): Promise<NewsletterStore> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      subscribers: [],
      stats: {
        totalSubscriptions: 0,
        totalUnsubscriptions: 0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

async function writeStore(store: NewsletterStore): Promise<void> {
  await ensureDataDir();
  store.stats.lastUpdated = new Date().toISOString();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

/**
 * Add or update a subscriber.
 */
export async function addSubscriber(
  email: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  categories: string[]
): Promise<{ isNew: boolean; subscriber: Subscriber }> {
  const store = await readStore();
  const existing = store.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    existing.frequency = frequency;
    existing.categories = categories;
    existing.active = true;
    existing.unsubscribedAt = undefined;
    await writeStore(store);
    return { isNew: false, subscriber: existing };
  }

  const subscriber: Subscriber = {
    email: email.toLowerCase(),
    frequency,
    categories,
    subscribedAt: new Date().toISOString(),
    active: true,
  };

  store.subscribers.push(subscriber);
  store.stats.totalSubscriptions++;
  await writeStore(store);
  return { isNew: true, subscriber };
}

/**
 * Unsubscribe an email.
 */
export async function unsubscribe(email: string): Promise<boolean> {
  const store = await readStore();
  const subscriber = store.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

  if (!subscriber || !subscriber.active) return false;

  subscriber.active = false;
  subscriber.unsubscribedAt = new Date().toISOString();
  store.stats.totalUnsubscriptions++;
  await writeStore(store);
  return true;
}

/**
 * Get subscription status for an email.
 */
export async function getSubscriptionStatus(email: string): Promise<Subscriber | null> {
  const store = await readStore();
  return store.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Get newsletter statistics.
 */
export async function getNewsletterStats(): Promise<{
  activeSubscribers: number;
  totalSubscriptions: number;
  totalUnsubscriptions: number;
  byFrequency: Record<string, number>;
  byCategory: Record<string, number>;
}> {
  const store = await readStore();
  const active = store.subscribers.filter(s => s.active);

  const byFrequency: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const sub of active) {
    byFrequency[sub.frequency] = (byFrequency[sub.frequency] || 0) + 1;
    for (const cat of sub.categories) {
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }
  }

  return {
    activeSubscribers: active.length,
    totalSubscriptions: store.stats.totalSubscriptions,
    totalUnsubscriptions: store.stats.totalUnsubscriptions,
    byFrequency,
    byCategory,
  };
}
