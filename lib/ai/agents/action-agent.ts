import type { AgentResponse, Language } from '../types'

/**
 * Action Agent
 * Handles form assistance and action-oriented requests
 * Helps users with form submission, inquiries, and feedback
 */

export class ActionAgent {
  /**
   * Process an action request
   */
  async processQuery(query: string, language: Language): Promise<AgentResponse> {
    const normalizedQuery = query.toLowerCase()

    // Check for form assistance requests
    if (this.isInquiryRequest(normalizedQuery)) {
      return this.helpWithInquiry(language)
    }

    if (this.isFeedbackRequest(normalizedQuery)) {
      return this.helpWithFeedback(language)
    }

    if (this.isDonationRequest(normalizedQuery)) {
      return this.helpWithDonation(language)
    }

    if (this.isEnrollmentRequest(normalizedQuery)) {
      return this.helpWithEnrollment(language)
    }

    // Default action help
    return this.getActionHelp(language)
  }

  private isInquiryRequest(query: string): boolean {
    const patterns = [
      /inquir/i,
      /ask.*about/i,
      /question.*about/i,
      /استفسار/i,
      /سوال/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isFeedbackRequest(query: string): boolean {
    const patterns = [
      /feedback/i,
      /contact.*you/i,
      /send.*message/i,
      /رائے/i,
      /پیغام/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isDonationRequest(query: string): boolean {
    const patterns = [/donat/i, /contribute/i, /give.*money/i, /عطیہ/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isEnrollmentRequest(query: string): boolean {
    const patterns = [
      /enroll/i,
      /register/i,
      /sign.*up/i,
      /join.*course/i,
      /رجسٹر/i,
      /اندراج/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private helpWithInquiry(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'اگر آپ کسی کورس یا سروس کے بارے میں استفسار کرنا چاہتے ہیں، تو براہ کرم متعلقہ سروس صفحے (مثلاً /services/it) پر جائیں اور انکوائری فارم بھریں۔'
        : 'If you want to inquire about a course or service, please visit the relevant service page (e.g., /services/it) and fill out the inquiry form.'

    return {
      success: true,
      message,
      language,
      agentType: 'action',
      metadata: { action: 'inquiry' },
    }
  }

  private helpWithFeedback(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'آپ ہم سے رابطہ کرنے کے لیے /contact پر جا سکتے ہیں اور فیڈبیک فارم بھر سکتے ہیں۔'
        : 'You can contact us by visiting /contact and filling out the feedback form.'

    return {
      success: true,
      message,
      language,
      agentType: 'action',
      metadata: { action: 'feedback', page: '/contact' },
    }
  }

  private helpWithDonation(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'عطیہ دینے کے لیے، براہ کرم ہوم پیج پر "Donate Now" بٹن پر کلک کریں یا ہم سے رابطہ کریں۔'
        : 'To make a donation, please click the "Donate Now" button on the home page or contact us at /contact'

    return {
      success: true,
      message,
      language,
      agentType: 'action',
      metadata: { action: 'donation' },
    }
  }

  private helpWithEnrollment(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'کسی کورس میں اندراج کے لیے، متعلقہ سروس صفحے پر جائیں (مثلاً IT کورسز کے لیے /services/it) اور انکوائری فارم بھریں۔'
        : 'To enroll in a course, visit the relevant service page (e.g., /services/it for IT courses) and fill out the inquiry form.'

    return {
      success: true,
      message,
      language,
      agentType: 'action',
      metadata: { action: 'enrollment' },
    }
  }

  private getActionHelp(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'میں آپ کو فارم بھرنے، رابطہ کرنے، یا دوسرے اقدامات میں مدد کر سکتا ہوں۔ آپ کیا کرنا چاہتے ہیں؟'
        : 'I can help you with filling forms, contacting us, or other actions. What would you like to do?'

    return {
      success: true,
      message,
      language,
      agentType: 'action',
    }
  }
}

export const actionAgent = new ActionAgent()
