import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import siteConfig from '@/config/site-config.json'

const resend = new Resend(process.env.RESEND_API_KEY || siteConfig.email.resendApiKey)

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
    const formData = await request.formData()

    const name = formData.get('name') as string
    const fatherName = formData.get('fatherName') as string
    const membershipNo = formData.get('membershipNo') as string
    const email = formData.get('email') as string
    const course = formData.get('course') as string
    const picture = formData.get('picture') as File | null

    if (!name || !fatherName || !email || !course) {
      return NextResponse.json({ success: false, error: 'Required fields are missing.' }, { status: 400 })
    }

    if (!picture || picture.size === 0) {
      return NextResponse.json({ success: false, error: 'Please upload your picture.' }, { status: 400 })
    }

    const sanitized = {
      name: sanitizeInput(name),
      fatherName: sanitizeInput(fatherName),
      membershipNo: membershipNo ? sanitizeInput(membershipNo) : 'N/A',
      email: sanitizeInput(email),
      course: sanitizeInput(course),
    }

    // Convert picture to buffer for email attachment
    const picBuffer = Buffer.from(await picture.arrayBuffer())
    const picExt = picture.type.includes('png') ? 'png' : 'jpg'

    try {
      await resend.emails.send({
        from: siteConfig.email.fromEmail,
        to: siteConfig.email.adminEmail,
        subject: `New IT Course Inquiry: ${sanitized.course}`,
        html: `
          <h2>New IT Course Enrollment Inquiry</h2>
          <p><strong>Name:</strong> ${sanitized.name}</p>
          <p><strong>Father's Name:</strong> ${sanitized.fatherName}</p>
          <p><strong>Membership No:</strong> ${sanitized.membershipNo}</p>
          <p><strong>Email:</strong> ${sanitized.email}</p>
          <p><strong>Course:</strong> ${sanitized.course}</p>
          <p><em>Picture attached below.</em></p>
        `,
        attachments: [
          {
            filename: `applicant-${sanitized.name.replace(/\s+/g, '-')}.${picExt}`,
            content: picBuffer,
          },
        ],
      })

      return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to send inquiry. Please try again later.' },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
