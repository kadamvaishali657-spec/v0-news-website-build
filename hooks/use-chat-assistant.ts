'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChatMessage,
  saveChatHistory,
  loadChatHistory,
  generateMessageId,
} from '@/lib/chat-utils';
import { Article } from '@/lib/rss-parser';

export function useChatAssistant(articles: Article[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory();
    setMessages(history);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Add user message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      const assistantMsgId = generateMessageId();

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Try streaming endpoint first
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            articles: articles.slice(0, 15).map((a) => ({
              title: a.title,
              source: a.source,
              category: a.category,
              description: typeof a.description === 'string' ? a.description.substring(0, 120) : '',
            })),
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          // Fall back to non-streaming endpoint
          const fallbackResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
              })),
              articles: articles.slice(0, 10),
            }),
            signal: abortController.signal,
          });

          if (!fallbackResponse.ok) {
            const errorData = await fallbackResponse.json();
            throw new Error(errorData.error || 'Failed to get response');
          }

          const data = await fallbackResponse.json();
          const assistantMessage: ChatMessage = {
            id: assistantMsgId,
            role: 'assistant',
            content: data.message,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          return;
        }

        // Stream the response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        // Add empty assistant message that we'll stream into
        const streamingMessage: ChatMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, streamingMessage]);

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulated } : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch (err) {
        if (abortController.signal.aborted) return;

        const errorMsg =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);

        const errorMessage: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, articles]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
