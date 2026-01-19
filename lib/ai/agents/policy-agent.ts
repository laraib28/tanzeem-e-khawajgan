import type { AgentResponse, Language } from '../types'

/**
 * Policy Agent
 * Rejects inappropriate requests (legal advice, medical advice, opinions, etc.)
 * Enforces content policy and boundaries
 */

export class PolicyAgent {
  /**
   * Check if query violates policy
   */
  async checkPolicy(query: string, language: Language): Promise<AgentResponse | null> {
    const normalizedQuery = query.toLowerCase()

    // Check for legal advice requests
    if (this.isLegalRequest(normalizedQuery)) {
      return this.rejectLegalRequest(language)
    }

    // Check for medical advice requests
    if (this.isMedicalAdviceRequest(normalizedQuery)) {
      return this.rejectMedicalAdvice(language)
    }

    // Check for opinion/political requests
    if (this.isOpinionRequest(normalizedQuery)) {
      return this.rejectOpinionRequest(language)
    }

    // Check for personal information requests
    if (this.isPersonalInfoRequest(normalizedQuery)) {
      return this.rejectPersonalInfoRequest(language)
    }

    // No policy violation
    return null
  }

  private isLegalRequest(query: string): boolean {
    const patterns = [
      /legal.*advice/i,
      /lawyer/i,
      /lawsuit/i,
      /court/i,
      /sue/i,
      /قانونی.*مشورہ/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isMedicalAdviceRequest(query: string): boolean {
    const patterns = [
      /diagnose/i,
      /treatment.*for/i,
      /should.*i.*take/i,
      /cure.*for/i,
      /symptoms/i,
      /طبی.*مشورہ/i,
      /علاج/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isOpinionRequest(query: string): boolean {
    const patterns = [
      /political.*opinion/i,
      /religious.*view/i,
      /who.*should.*vote/i,
      /سیاسی.*رائے/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isPersonalInfoRequest(query: string): boolean {
    const patterns = [
      /personal.*phone/i,
      /home.*address/i,
      /private.*email/i,
      /ذاتی.*معلومات/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private rejectLegalRequest(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'معذرت، میں قانونی مشورہ فراہم نہیں کر سکتا۔ براہ کرم پیشہ ور وکیل سے رابطہ کریں۔'
        : 'I apologize, but I cannot provide legal advice. Please consult with a qualified attorney.'

    return {
      success: false,
      message,
      language,
      agentType: 'policy',
      metadata: { violation: 'legal_advice' },
    }
  }

  private rejectMedicalAdvice(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'معذرت، میں طبی مشورہ نہیں دے سکتا۔ براہ کرم ڈاکٹر سے رابطہ کریں۔ ہماری میڈیکل سروس کے بارے میں معلومات کے لیے /services/medical دیکھیں۔'
        : 'I cannot provide medical advice. Please consult a healthcare professional. For information about our medical services, visit /services/medical'

    return {
      success: false,
      message,
      language,
      agentType: 'policy',
      metadata: { violation: 'medical_advice' },
    }
  }

  private rejectOpinionRequest(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'معذرت، میں سیاسی یا مذہبی آراء کا اظہار نہیں کر سکتا۔ میں تنظیم کے بارے میں معلومات فراہم کر سکتا ہوں۔'
        : 'I cannot express political or religious opinions. I can provide information about the organization and its services.'

    return {
      success: false,
      message,
      language,
      agentType: 'policy',
      metadata: { violation: 'opinion_request' },
    }
  }

  private rejectPersonalInfoRequest(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'معذرت، میں ذاتی معلومات فراہم نہیں کر سکتا۔ عام رابطے کی معلومات کے لیے /contact دیکھیں۔'
        : 'I cannot provide personal information. For general contact information, please visit /contact'

    return {
      success: false,
      message,
      language,
      agentType: 'policy',
      metadata: { violation: 'personal_info' },
    }
  }
}

export const policyAgent = new PolicyAgent()
