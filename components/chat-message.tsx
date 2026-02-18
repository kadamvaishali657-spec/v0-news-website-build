'use client';

import { ChatMessage as ChatMessageType } from '@/hooks/use-chat';
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
          isUser ? 'bg-accent' : 'bg-muted'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-accent-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`flex-1 max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-none'
            : 'bg-muted text-muted-foreground rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
