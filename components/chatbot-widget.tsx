'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Trash2 } from 'lucide-react';
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

  // Auto-scroll to bottom when new messages arrive
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
      {/* Floating Button - Premium Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent hover:to-accent text-foreground rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 z-40 flex items-center justify-center transform hover:scale-110 active:scale-95"
        aria-label="Toggle chat"
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-6 h-6 rotate-180 transition-transform duration-300" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6 transition-all duration-300" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">!</span>
            </>
          )}
        </div>
      </button>

      {/* Chat Window - Enhanced with animations */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-card rounded-2xl shadow-2xl flex flex-col z-40 border border-border animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header - Gradient */}
          <div className="bg-gradient-to-r from-accent to-accent/70 text-foreground px-6 py-5 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">INFORMED Assistant</h3>
              <p className="text-xs opacity-90 font-medium">Powered by AI • Ask about news</p>
            </div>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-accent/20 rounded-lg transition-all duration-300 hover:scale-110"
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container - Smooth scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="text-5xl mb-4 animate-bounce">💬</div>
                <h4 className="font-display text-foreground mb-2 font-semibold">Start a Conversation</h4>
                <p className="text-sm text-foreground/60">
                  Ask me about breaking news, summaries, or recent trends
                </p>
                <div className="mt-6 text-xs text-foreground/50 space-y-2">
                  <p>Try: "What's trending today?"</p>
                  <p>Or: "Summarize recent tech news"</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div 
                    key={message.id} 
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <ChatMessage message={message} />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area - Premium */}
          <div className="border-t border-border bg-card p-4 rounded-b-2xl">
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
