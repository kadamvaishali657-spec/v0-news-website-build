'use client';

import { ChatMessage as ChatMessageType } from '@/lib/chat-utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-accent text-accent-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`flex-1 max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-none shadow-md'
            : 'bg-card text-card-foreground border border-border rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span className={`text-xs opacity-70 mt-2 block ${isUser ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
