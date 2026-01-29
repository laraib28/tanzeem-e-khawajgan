import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/ai/session-manager'
import { mainAgent } from '@/lib/ai/main-agent'
import type { Language } from '@/lib/ai/types'

// Rate limiting storage (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting: 10 requests per minute per IP
const RATE_LIMIT_REQUESTS = 10
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Check rate limit
    const now = Date.now()
    const clientLimit = rateLimitMap.get(ip)

    if (clientLimit) {
      if (now < clientLimit.resetTime) {
        if (clientLimit.count >= RATE_LIMIT_REQUESTS) {
          return NextResponse.json(
            {
              success: false,
              error: 'Too many requests. Please try again later.',
              retryAfter: Math.ceil((clientLimit.resetTime - now) / 1000),
            },
            { status: 429 }
          )
        }
        clientLimit.count++
      } else {
        // Reset the limit
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }

    const body = await request.json()
    const { action, sessionId, message, language = 'en' } = body

    // Handle initialization
    if (action === 'init') {
      const session = sessionManager.createSession(language as Language)
      const greeting = mainAgent.getGreeting(language as Language)

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        greeting,
      })
    }

    // Handle message
    if (action === 'message') {
      if (!sessionId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Session ID is required',
          },
          { status: 400 }
        )
      }

      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Message is required',
          },
          { status: 400 }
        )
      }

      // Get session
      const session = sessionManager.getSession(sessionId)
      if (!session) {
        return NextResponse.json(
          {
            success: false,
            error: 'Session not found or expired',
          },
          { status: 404 }
        )
      }

      // Check message limit
      if (session.messageCount >= 50) {
        return NextResponse.json(
          {
            success: false,
            error: 'Maximum messages per session exceeded',
          },
          { status: 429 }
        )
      }

      try {
        // Add user message to session
        sessionManager.addMessage(sessionId, 'user', message, language as Language)

        // Process query through main agent
        const agentResponse = await mainAgent.processQuery(message, language as Language)

        // Add assistant response to session
        sessionManager.addMessage(
          sessionId,
          'assistant',
          agentResponse.message,
          agentResponse.language
        )

        return NextResponse.json({
          success: true,
          response: agentResponse.message,
          language: agentResponse.language,
          agentType: agentResponse.agentType,
          metadata: agentResponse.metadata,
        })
      } catch (error) {
        // Check if it's a message limit error
        if (error instanceof Error && error.message.includes('Maximum messages')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Maximum messages per session exceeded',
            },
            { status: 429 }
          )
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Failed to process message',
          },
          { status: 500 }
        )
      }
    }

    // Invalid action
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request',
      },
      { status: 500 }
    )
  }
}
