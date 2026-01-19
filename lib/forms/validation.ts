import { z } from 'zod'

// Inquiry Form Schema (for IT courses)
export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number is too long'),
  course: z.string().min(1, 'Please select a course'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
})

// Feedback Form Schema (for contact page)
export const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000, 'Message is too long'),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
export type FeedbackFormData = z.infer<typeof feedbackSchema>
