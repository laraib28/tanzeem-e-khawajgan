import type { AgentResponse, Language } from '../types'

/**
 * Information Agent
 * Answers questions about the organization from website content
 * Handles: history, mission, values, programs, general info
 */

export class InformationAgent {
  /**
   * Process an information query
   */
  async processQuery(query: string, language: Language): Promise<AgentResponse> {
    // Normalize query for pattern matching
    const normalizedQuery = query.toLowerCase()

    // Check for common information queries
    if (this.isAboutQuery(normalizedQuery)) {
      return this.getAboutInfo(language)
    }

    if (this.isMissionQuery(normalizedQuery)) {
      return this.getMissionInfo(language)
    }

    if (this.isHistoryQuery(normalizedQuery)) {
      return this.getHistoryInfo(language)
    }

    if (this.isValuesQuery(normalizedQuery)) {
      return this.getValuesInfo(language)
    }

    if (this.isBoardQuery(normalizedQuery)) {
      return this.getBoardInfo(language)
    }

    // Default response for unmatched queries
    return this.getDefaultResponse(language)
  }

  private isAboutQuery(query: string): boolean {
    const patterns = [
      /about.*organization/i,
      /what.*is.*tanzeem/i,
      /tell.*me.*about/i,
      /تنظیم.*کیا.*ہے/i,
    ]
    return patterns.some(pattern => pattern.test(query))
  }

  private isMissionQuery(query: string): boolean {
    const patterns = [/mission/i, /purpose/i, /goal/i, /مقصد/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isHistoryQuery(query: string): boolean {
    const patterns = [/history/i, /founded/i, /established/i, /when.*start/i, /تاریخ/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isValuesQuery(query: string): boolean {
    const patterns = [/value/i, /principle/i, /belief/i, /اقدار/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isBoardQuery(query: string): boolean {
    const patterns = [/board/i, /member/i, /committee/i, /leader/i, /president/i, /ممبر/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private getAboutInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'تنظیم خواجگان ایک تنظیم ہے جو معاشرے کی خدمت کے لیے وقف ہے۔ ہم تعلیم، صحت، کھیل، اور دیگر شعبوں میں خدمات فراہم کرتے ہیں۔'
        : 'Tanzeem-e-Khawjgan is an organization dedicated to serving the community. We provide services in education, health, sports, and other areas.'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }

  private getMissionInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہمارا مقصد معاشرے کی ترقی اور لوگوں کی زندگیوں کو بہتر بنانا ہے۔'
        : 'Our mission is to improve the community and enhance people\'s lives through quality services and programs.'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }

  private getHistoryInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'تنظیم خواجگان کی تاریخ بہت امیر ہے۔ مزید معلومات کے لیے "About" صفحہ دیکھیں۔'
        : 'Tanzeem-e-Khawjgan has a rich history of community service. Visit the About page for more details.'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }

  private getValuesInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری اقدار میں ایمانداری، خدمت، اور معاشرتی ذمہ داری شامل ہیں۔'
        : 'Our values include integrity, service, and community responsibility.'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }

  private getBoardInfo(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری تنظیم کی قیادت ایک سرشار بورڈ کرتا ہے۔ تفصیلات "Board of Members" صفحہ پر دیکھیں۔'
        : 'Our organization is led by a dedicated board. See the Board of Members page for details.'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }

  private getDefaultResponse(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'میں اس بارے میں مزید معلومات فراہم کر سکتا ہوں۔ کیا آپ تنظیم کی خدمات یا دیگر معلومات کے بارے میں جاننا چاہتے ہیں؟'
        : 'I can provide more information. Would you like to know about our services or other information about the organization?'

    return {
      success: true,
      message,
      language,
      agentType: 'information',
    }
  }
}

export const informationAgent = new InformationAgent()
