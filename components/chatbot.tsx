'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { MessageCircle, X, Trash2 } from 'lucide-react';
import { Article } from '@/lib/rss-parser';
import { Loader2 } from 'lucide-react';

interface ChatBotProps {
  articles?: Article[];
}

export function ChatBot({ articles }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat(articles);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearHistory();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center w-14 h-14"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-96 max-h-96 bg-background border border-border rounded-lg shadow-xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">News Assistant</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p className="mb-3 font-semibold">Hi! I'm your News Assistant.</p>
                <p className="mb-4">I can help you with:</p>
                <div className="space-y-2 text-xs text-left">
                  <p>📰 Discuss news articles and current events</p>
                  <p>🔍 Help you search for topics</p>
                  <p>📚 Summarize news stories</p>
                  <p>✍️ Guide you on publishing articles</p>
                  <p>📧 Assist with newsletter setup</p>
                  <p>⚙️ Explain site features</p>
                  <p>💾 Help with saving articles</p>
                </div>
                <p className="mt-4 text-xs">Ask me anything about news or how to use the site!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border-t border-red-700/30 px-4 py-2 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border px-4 py-3 bg-card">
            <ChatInput
              onSendMessage={sendMessage}
              isLoading={isLoading}
              disabled={!messages.length && isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
}
