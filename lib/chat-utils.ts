import { Article } from './rss-parser';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

const CHAT_STORAGE_KEY = 'chat-history';
const MAX_MESSAGES = 50;
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Build system prompt with article context
 */
export function buildChatSystemPrompt(articles: Article[]): string {
  const articlesToInclude = articles.slice(0, 10);
  const articlesSummary = articlesToInclude
    .map((a) => `- "${a.title}" (${a.source}, ${a.category})`)
    .join('\n');

  return `You are a helpful news assistant for a global news aggregator website. Your role is to:
1. Answer questions about current news articles
2. Help users search for news topics they're interested in
3. Provide summaries and insights about news stories
4. Recommend relevant articles based on user interests
5. Have natural conversations about current events

Currently available articles:
${articlesSummary}

Be concise, informative, and helpful. Reference articles when relevant to the user's questions.`;
}

/**
 * Save chat history to localStorage
 */
export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    const sessions = JSON.parse(
      localStorage.getItem(CHAT_STORAGE_KEY) || '[]'
    ) as ChatSession[];

    // Create or update current session
    const now = Date.now();
    let currentSession = sessions[sessions.length - 1];

    if (!currentSession || now - currentSession.createdAt > SESSION_TIMEOUT) {
      currentSession = {
        id: `session-${now}`,
        messages: [],
        createdAt: now,
      };
      sessions.push(currentSession);
    }

    // Keep only last MAX_MESSAGES
    currentSession.messages = messages.slice(-MAX_MESSAGES);

    // Clean up old sessions (older than 7 days)
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const activeSessions = sessions.filter((s) => s.createdAt > sevenDaysAgo);

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(activeSessions));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

/**
 * Load chat history from localStorage
 */
export function loadChatHistory(): ChatMessage[] {
  try {
    const sessions = JSON.parse(
      localStorage.getItem(CHAT_STORAGE_KEY) || '[]'
    ) as ChatSession[];

    if (sessions.length === 0) return [];

    const currentSession = sessions[sessions.length - 1];
    return currentSession.messages || [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

/**
 * Clear all chat history
 */
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
