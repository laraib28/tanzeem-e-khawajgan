'use client'

import type { Message } from '@/lib/ai/types'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isUrdu = message.language === 'ur'

  // Don't render system messages
  if (message.role === 'system') {
    return null
  }

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${
        isUrdu ? 'text-right' : 'text-left'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-accent'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-white'
              : 'bg-foreground/10 text-foreground'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-foreground/50 px-2">
          {new Date(message.timestamp).toLocaleTimeString(
            isUrdu ? 'ur-PK' : 'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          )}
        </span>
      </div>
    </div>
  )
}
