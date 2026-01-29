import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { inquirySchema } from '@/lib/forms/validation'
import siteConfig from '@/config/site-config.json'

const resend = new Resend(siteConfig.email.resendApiKey)

// Simple XSS sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validationResult = inquirySchema.safeParse(body)

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

    const { name, email, phone, course, message } = validationResult.data

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      course: sanitizeInput(course),
      message: sanitizeInput(message),
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: siteConfig.email.fromEmail,
        to: siteConfig.email.adminEmail,
        subject: `New IT Course Inquiry: ${sanitizedData.course}`,
        html: `
          <h2>New Course Inquiry</h2>
          <p><strong>Name:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
          <p><strong>Course:</strong> ${sanitizedData.course}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedData.message}</p>
        `,
      })

      return NextResponse.json({
        success: true,
        message: 'Inquiry submitted successfully',
      })
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send inquiry. Please try again later.',
        },
        { status: 500 }
      )
    }
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
