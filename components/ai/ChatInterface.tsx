'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Message } from '@/lib/ai/types'
import { Send, X, Loader2, MessageCircle } from 'lucide-react'
import './chat.css'

interface ChatInterfaceProps {
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Fallback responses when backend is unavailable
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase()

  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('salam') || msg.includes('assalam')) {
    return 'Wa Alaikum Assalam! Welcome to Tanzeem-e-Khawajgan. I can help you with information about our services:\n\n• Medical Services\n• IT Courses\n• Education Programs\n• Sports Facilities\n• Banquet Hall Booking\n\nWhat would you like to know about?'
  }

  // Booking intent
  if (msg.includes('book') || msg.includes('hall') || msg.includes('banquet') || msg.includes('venue') || msg.includes('wedding')) {
    return 'We have the following banquet halls available:\n\n🏛️ **Grand Hall** - Capacity: 500 guests (PKR 5,000/hour)\n🏢 **Conference Room A** - Capacity: 50 guests (PKR 1,000/hour)\n🌳 **Garden Lawn** - Capacity: 300 guests (PKR 3,000/hour)\n\nWhich hall interests you? Please provide your preferred date.'
  }

  // Services
  if (msg.includes('service') || msg.includes('what do you offer')) {
    return 'Tanzeem-e-Khawajgan offers these services:\n\n• **Medical**: Healthcare, diagnostics, emergency care\n• **IT**: Computer courses, programming training\n• **Education**: Programs, scholarships, tutoring\n• **Sports**: Fitness facilities, sports programs\n• **Banquets**: Event halls for weddings/gatherings\n\nWhich service would you like to know more about?'
  }

  // Medical
  if (msg.includes('medical') || msg.includes('doctor') || msg.includes('health')) {
    return 'Our Medical Services include:\n\n• Diagnostic center\n• General consultations\n• Emergency care\n• Specialist referrals\n\nFor appointments, please contact our medical center directly.'
  }

  // IT
  if (msg.includes('it') || msg.includes('computer') || msg.includes('course') || msg.includes('programming')) {
    return 'Our IT Department offers:\n\n• Web Development courses\n• Programming training (Python, JavaScript)\n• Computer basics\n• Summer coding camps for kids\n\nEnrollment is open throughout the year.'
  }

  // Default response
  return 'Thank you for your message! I can help you with:\n\n• Information about our services\n• Banquet hall booking\n• Medical services\n• IT courses\n• Education programs\n\nPlease ask about any of these topics.'
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState<string>(() =>
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add initial greeting message
  useEffect(() => {
    const greetingMessage: Message = {
      id: 'greeting',
      role: 'assistant',
      content: 'Assalam-o-Alaikum! Welcome to Tanzeem-e-Khawajgan. How can I help you today? You can ask me about our services, programs, or any general information.',
      language: 'en',
      timestamp: Date.now(),
    }
    setMessages([greetingMessage])
  }, [])

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = inputValue.trim()
    if (!trimmedInput || isLoading) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      language: 'en',
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Normalize response - handle both expected format and edge cases
      const responseText = data.response || data.message || data.detail || 'I received your message.'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        language: 'en',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])

      // Add follow-up suggestion if available
      if (data.follow_up) {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: data.follow_up,
          language: 'en',
          timestamp: Date.now(),
        }
        setTimeout(() => {
          setMessages(prev => [...prev, followUpMessage])
        }, 500)
      }
    } catch (error) {
      console.error('Chat error:', error)

      // Fallback response when backend is not available
      const fallbackResponse = getFallbackResponse(trimmedInput)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        language: 'en',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] flex flex-col z-50 border-primary/20">
      {/* Header */}
      <CardHeader className="chat-header flex flex-row items-center justify-between p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
            <p className="text-xs text-muted-foreground">Ask me anything</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close chat"
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* Messages */}
      <CardContent className="chat-window flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                  <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-muted-foreground">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-transparent"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
