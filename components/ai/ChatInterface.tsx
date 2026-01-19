'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage'
import type { Message, Language } from '@/lib/ai/types'
import { Send, X, Loader2 } from 'lucide-react'

interface ChatInterfaceProps {
  onClose: () => void
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>('en')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize session
  const initializeSession = async () => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init', language }),
      })

      const data = await response.json()

      if (data.success) {
        setSessionId(data.sessionId)
        if (data.greeting) {
          const greetingMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.greeting,
            language,
            timestamp: Date.now(),
          }
          setMessages([greetingMessage])
        }
      }
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }

  useEffect(() => {
    initializeSession()
  }, [language])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading || !sessionId) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      language,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'message',
          sessionId,
          message: userMessage.content,
          language,
        }),
      })

      const data = await response.json()

      if (data.success && data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          language: data.language || language,
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'ur'
          ? 'معذرت، ایک خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔'
          : 'Sorry, an error occurred. Please try again.',
        language,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'))
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-background border border-foreground/20 rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-foreground/60">
              {language === 'ur' ? 'مدد کے لیے تیار' : 'Ready to help'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="px-2 py-1 text-xs rounded bg-foreground/10 hover:bg-foreground/20 transition-colors"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/60">
                {language === 'ur' ? 'جواب لکھ رہا ہے...' : 'Typing...'}
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-foreground/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              language === 'ur'
                ? 'اپنا پیغام لکھیں...'
                : 'Type your message...'
            }
            className="flex-1 px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
