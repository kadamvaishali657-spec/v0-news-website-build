'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Trash2, Sparkles } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useChatAssistant } from '@/hooks/use-chat-assistant';
import { Article } from '@/lib/rss-parser';

interface ChatBotProps {
  articles: Article[];
}

export function ChatBotWidget({ articles }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } =
    useChatAssistant(articles);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleClear = () => {
    if (confirm('Clear all chat history?')) {
      clearMessages();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-card border border-border/60 text-foreground hover:bg-muted/60 rotate-0'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[480px] bg-card rounded-2xl shadow-2xl shadow-black/[0.12] flex flex-col z-40 border border-border/40 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">News Assistant</h3>
                <p className="text-xs text-white/70">AI-powered news chat</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-4 h-4 text-white/70 hover:text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-7 h-7 text-primary/40" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    How can I help?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ask me about articles, get summaries, or find news on topics you&apos;re interested in.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 bg-card p-3">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
}
