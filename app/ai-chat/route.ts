import { NextRequest } from 'next/server'
import { chatService } from '@/lib/ai/chat-service'
import type { ChatMessage } from '@/lib/ai/chat-service'

// Rate limiting (in-memory per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 15
const RATE_WINDOW = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (limit && now < limit.resetTime) {
    if (limit.count >= RATE_LIMIT) return false
    limit.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
  }
  return true
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return jsonError('Too many requests. Try again later.', 429)
  }

  let body: { message?: string; history?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const { message, history = [] } = body
  if (!message || typeof message !== 'string') {
    return jsonError('Message is required', 400)
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chunks = await chatService.streamResponse(message, history)
        for await (const text of chunks) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          )
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
