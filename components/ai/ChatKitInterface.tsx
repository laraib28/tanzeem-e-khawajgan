'use client'

import { useEffect, useRef } from 'react'
import { useChatKit, ChatKit } from '@openai/chatkit-react'
import { Button } from '@/components/ui/button'
import { X, MessageCircle } from 'lucide-react'

interface ChatKitInterfaceProps {
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export function ChatKitInterface({ onClose }: ChatKitInterfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize ChatKit with custom backend
  const { control } = useChatKit({
    api: {
      url: `${BACKEND_URL}/chatkit`,
      domainKey: 'tanzeem-chatbot',
    },
  })

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by OpenAI</p>
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
      </div>

      {/* ChatKit Container */}
      <div className="flex-1 overflow-hidden">
        <ChatKit
          control={control}
          className="h-full w-full"
          style={{
            '--chatkit-primary': 'hsl(var(--primary))',
            '--chatkit-background': 'hsl(var(--background))',
            '--chatkit-foreground': 'hsl(var(--foreground))',
          } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
