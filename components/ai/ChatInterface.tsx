'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Message } from '@/lib/ai/types'
import { getErrorMessage } from '@/lib/api-client'
import { Send, X, Loader2, MessageCircle, Volume2, Trash2 } from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import './chat.css'

interface ChatInterfaceProps {
  onClose: () => void
}

interface HistoryItem {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'tk_chat_history'
const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Assalam-o-Alaikum! 🌙\n\nTanzeem-e-Khawajgan mein khush aamdeed! Main aapka AI assistant hoon.\n\nAap Roman Urdu ya English mein baat kar sakte hain.\n\nKya jaanna chahte hain?',
  language: 'en',
  timestamp: 0,
}

function speakText(text: string) {
  if ('speechSynthesis' in window) {
    const clean = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '')
    const utt = new SpeechSynthesisUtterance(clean)
    utt.lang = 'en-US'
    utt.rate = 0.9
    window.speechSynthesis.speak(utt)
  }
}

function loadPersistedState(): { messages: Message[]; history: HistoryItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore storage errors
  }
  return { messages: [GREETING], history: [] }
}

function persistState(messages: Message[], history: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, history }))
  } catch {
    // ignore storage errors
  }
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Restore persisted state on mount
  useEffect(() => {
    const saved = loadPersistedState()
    setMessages(saved.messages)
    setHistory(saved.history)
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const clearChat = () => {
    const fresh = { messages: [GREETING], history: [] }
    setMessages(fresh.messages)
    setHistory(fresh.history)
    localStorage.removeItem(STORAGE_KEY)
  }

  const speakLastMessage = () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant')
    if (last) speakText(last.content)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      language: 'en',
      timestamp: Date.now(),
    }

    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      language: 'en',
      timestamp: Date.now() + 1,
    }

    const nextMessages = [...messages, userMsg, assistantMsg]
    setMessages(nextMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await fetch('/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value, { stream: true }).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          let parsed: Record<string, string> | null = null
          try { parsed = JSON.parse(data) } catch { continue }
          if (!parsed) continue
          if (parsed.error) throw new Error(parsed.error)
          if (parsed.text) {
            fullText += parsed.text
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId ? { ...m, content: fullText } : m
              )
            )
          }
        }
      }

      const nextHistory: HistoryItem[] = [
        ...history,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: fullText },
      ]
      setHistory(nextHistory)

      // Persist agent state to localStorage
      const finalMessages = nextMessages.map(m =>
        m.id === assistantId ? { ...m, content: fullText } : m
      )
      persistState(finalMessages, nextHistory)
    } catch (err) {
      const errorText = getErrorMessage(err)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: errorText } : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] flex flex-col z-50 border-primary/20">
      <CardHeader className="chat-header flex flex-row items-center justify-between p-4 rounded-t-lg bg-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-white">AI Assistant</CardTitle>
            <p className="text-xs text-white/70">Powered by GPT-4o mini</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={speakLastMessage}
            aria-label="Listen to response"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear conversation"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close chat"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="chat-window flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <form onSubmit={handleSubmit} className="chat-input border-t p-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your question..."
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
