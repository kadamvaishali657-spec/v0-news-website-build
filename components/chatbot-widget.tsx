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
  }, [messages, isOpen]);

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
      {/* Floating Button with Glow Effect */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <div className="absolute inset-0 bg-accent/30 rounded-2xl blur-xl group-hover:bg-accent/50 transition-all duration-300 animate-pulse" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-500 transform ${
            isOpen
              ? 'bg-card border border-border/60 text-foreground rotate-90 scale-90'
              : 'bg-accent text-white hover:scale-110 active:scale-95'
          }`}
          aria-label="Toggle news assistant"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}

          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-2.5 h-2.5 text-accent" />
            </div>
          )}
        </button>
      </div>

      {/* Premium Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] glass rounded-3xl shadow-2xl flex flex-col z-40 border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-accent to-accent/80 text-white px-6 py-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base tracking-wide">INFORMED AI</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-medium">Global Intelligence Partner</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
              title="Reset Intelligence"
            >
              <Trash2 className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/30 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center px-6">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-10 h-10 text-accent/40" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-foreground mb-2">
                    System Online
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-serif italic">
                    "I am your dedicated intelligence partner. Ask me to summarize the news, find specific topics, or analyze global trends."
                  </p>
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

          {/* Input Area */}
          <div className="p-4 bg-background/50 backdrop-blur-md border-t border-white/5">
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
