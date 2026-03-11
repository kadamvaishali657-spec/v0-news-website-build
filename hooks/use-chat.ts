'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_STORAGE_KEY = 'newsbot-chat-history';
const MAX_STORED_MESSAGES = 50;

export function useChat(articleContext?: any[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (e) {
      // Silently fail if localStorage is not available or corrupted
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        const toStore = messages.slice(-MAX_STORED_MESSAGES);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toStore));
      }
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsLoading(true);

      // Add user message to the chat
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        // Prepare messages for API (exclude timestamps and IDs for API)
        const messagesForAPI = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
        messagesForAPI.push({
          role: 'user',
          content: userMessage,
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            messages: messagesForAPI,
            articles: articleContext || [],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await response.json();

        if (!data.success || !data.message) {
          throw new Error('Invalid response format');
        }

        // Add assistant message to the chat
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        let errorMsg = 'Failed to send message';
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMsg = 'Request timeout. Please try again.';
          } else {
            errorMsg = err.message;
          }
        }
        
        // Check if it's a network/API error
        if (errorMsg.includes('Failed') || errorMsg.includes('fetch')) {
          errorMsg = 'Chat service temporarily unavailable. Please try again later.';
          
          // Add a helpful assistant message
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: 'I apologize, but the chat service is temporarily unavailable. Please try again in a moment. In the meantime, you can browse articles or use the search feature.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
        
        setError(errorMsg);
        setIsLoading(false);
      }
    },
    [messages, articleContext]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (e) {
      // Silently fail
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
}
