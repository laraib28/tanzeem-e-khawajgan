import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { feedbackSchema } from '@/lib/forms/validation'
import siteConfig from '@/config/site-config.json'

const resend = new Resend(siteConfig.email.resendApiKey)

// Simple rate limiting storage (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting: 5 requests per 15 minutes per IP
const RATE_LIMIT_REQUESTS = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds

// Simple XSS sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Simple anti-spam check: detect suspicious patterns
function isSpam(message: string): boolean {
  const spamPatterns = [
    /viagra|cialis|casino|lottery|winner/i,
    /(http|https):\/\/.*\..*\..*/, // Multiple dots in URLs (suspicious)
    /\b(buy now|click here|limited time|act now)\b/i,
  ]

  return spamPatterns.some(pattern => pattern.test(message))
}

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

    // Validate input data
    const validationResult = feedbackSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          fields: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validationResult.data

    // Anti-spam check
    if (isSpam(message) || isSpam(subject)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Your message was flagged as spam. Please contact us directly.',
        },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: siteConfig.email.fromEmail,
        to: siteConfig.email.adminEmail,
        subject: `Contact Form: ${sanitizedData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
        `,
      })

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message. Please try again later.',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request',
      },
      { status: 500 }
    )
  }
}
