import type { AgentResponse, Language } from '../types'

/**
 * Services Agent
 * Handles service-specific queries (IT, Medical, Education, Sports, Banquets, Graveyard)
 * Provides information about each service offering
 */

export class ServicesAgent {
  /**
   * Process a service query
   */
  async processQuery(query: string, language: Language): Promise<AgentResponse> {
    const normalizedQuery = query.toLowerCase()

    // Check for specific service queries
    if (this.isITQuery(normalizedQuery)) {
      return this.getITServiceInfo(language)
    }

    if (this.isMedicalQuery(normalizedQuery)) {
      return this.getMedicalServiceInfo(language)
    }

    if (this.isEducationQuery(normalizedQuery)) {
      return this.getEducationServiceInfo(language)
    }

    if (this.isSportsQuery(normalizedQuery)) {
      return this.getSportsServiceInfo(language)
    }

    if (this.isBanquetsQuery(normalizedQuery)) {
      return this.getBanquetsServiceInfo(language)
    }

    if (this.isGraveyardQuery(normalizedQuery)) {
      return this.getGraveyardServiceInfo(language)
    }

    // Default services overview
    return this.getServicesOverview(language)
  }

  private isITQuery(query: string): boolean {
    const patterns = [
      /\bit\b/i,
      /computer/i,
      /web.*dev/i,
      /programming/i,
      /software/i,
      /کمپیوٹر/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isMedicalQuery(query: string): boolean {
    const patterns = [/medical/i, /health/i, /clinic/i, /doctor/i, /طبی/i, /صحت/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isEducationQuery(query: string): boolean {
    const patterns = [/education/i, /school/i, /learning/i, /student/i, /تعلیم/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isSportsQuery(query: string): boolean {
    const patterns = [/sport/i, /gym/i, /fitness/i, /کھیل/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isBanquetsQuery(query: string): boolean {
    const patterns = [/banquet/i, /hall/i, /event.*venue/i, /بینکویٹ/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isGraveyardQuery(query: string): boolean {
    const patterns = [/graveyard/i, /cemetery/i, /burial/i, /قبرستان/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private getITServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری IT سروس میں ویب ڈویلپمنٹ، گرافک ڈیزائن، اور دیگر کورسز شامل ہیں۔ تفصیلات کے لیے /services/it پر جائیں۔'
        : 'Our IT service offers courses in Web Development, Graphic Design, and more. Visit /services/it for details.'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'it', page: '/services/it' },
    }
  }

  private getMedicalServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری طبی سروس میں جنرل چیک اپ، لیبارٹری ٹیسٹ، اور دیگر سہولیات شامل ہیں۔ تفصیلات: /services/medical'
        : 'Our medical service includes General Checkups, Laboratory Tests, and more. Details: /services/medical'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'medical', page: '/services/medical' },
    }
  }

  private getEducationServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری تعلیمی سروس میں اسکالرشپ، ٹیوشن، اور دیگر پروگرام شامل ہیں۔ مزید: /services/education'
        : 'Our education service provides Scholarships, Tuition Programs, and more. More: /services/education'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'education', page: '/services/education' },
    }
  }

  private getSportsServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری کھیل کی سہولیات میں فٹنس سینٹر، باسکٹ بال کورٹ، اور مزید شامل ہیں۔ دیکھیں: /services/sports'
        : 'Our sports facilities include Fitness Center, Basketball Court, and more. See: /services/sports'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'sports', page: '/services/sports' },
    }
  }

  private getBanquetsServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہمارے بینکویٹ ہال تقریبات کے لیے دستیاب ہیں۔ تفصیلات: /services/banquets'
        : 'Our banquet halls are available for events. Details: /services/banquets'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'banquets', page: '/services/banquets' },
    }
  }

  private getGraveyardServiceInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری قبرستان کی خدمات دستیاب ہیں۔ معلومات: /services/graveyard'
        : 'Our graveyard services are available. Information: /services/graveyard'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
      metadata: { service: 'graveyard', page: '/services/graveyard' },
    }
  }

  private getServicesOverview(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہم IT، طبی، تعلیم، کھیل، بینکویٹ، اور قبرستان کی خدمات فراہم کرتے ہیں۔ آپ کس سروس کے بارے میں جاننا چاہتے ہیں؟'
        : 'We offer IT, Medical, Education, Sports, Banquets, and Graveyard services. Which service would you like to know about?'

    return {
      success: true,
      message,
      language,
      agentType: 'services',
    }
  }
}

export const servicesAgent = new ServicesAgent()
