'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { ChatInterface } from './ChatInterface'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import './chat.css'

// Lazy load ChatKit interface for better performance
const ChatKitInterface = lazy(() =>
  import('./ChatKitInterface').then(mod => ({ default: mod.ChatKitInterface }))
)

// Check if ChatKit should be used (set via env variable)
const USE_CHATKIT = process.env.NEXT_PUBLIC_USE_CHATKIT === 'true'

function ChatLoader() {
  return (
    <div className="fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] bg-background border border-border rounded-lg shadow-2xl flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [chatKitError] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close chat on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!isMounted) {
    return null
  }

  // Determine which chat interface to use
  const useChatKit = USE_CHATKIT && !chatKitError

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        useChatKit ? (
          <Suspense fallback={<ChatLoader />}>
            <ChatKitInterface onClose={() => setIsOpen(false)} />
          </Suspense>
        ) : (
          <ChatInterface onClose={() => setIsOpen(false)} />
        )
      )}

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          'fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300',
          isOpen && 'opacity-0 pointer-events-none'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Tooltip for the button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 z-50 hidden sm:block">
          <div className="bg-foreground text-background text-sm px-3 py-1.5 rounded-lg shadow-lg animate-bounce">
            Need help? Chat with us!
          </div>
        </div>
      )}
    </>
  )
}
