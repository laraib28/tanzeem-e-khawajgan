import type { AgentResponse, Language } from './types'
import { informationAgent } from './agents/information-agent'
import { navigationAgent } from './agents/navigation-agent'
import { servicesAgent } from './agents/services-agent'
import { policyAgent } from './agents/policy-agent'
import { actionAgent } from './agents/action-agent'

/**
 * Main Agent (Controller)
 * Routes queries to appropriate sub-agents based on query classification
 * Implements language detection for bilingual support
 */

export class MainAgent {
  /**
   * Process a user query and route to appropriate agent
   */
  async processQuery(query: string, sessionLanguage?: Language): Promise<AgentResponse> {
    // Detect language if not provided
    const language = sessionLanguage || this.detectLanguage(query)

    // First check for policy violations
    const policyCheck = await policyAgent.checkPolicy(query, language)
    if (policyCheck) {
      return policyCheck
    }

    // Classify query and route to appropriate agent
    const queryType = this.classifyQuery(query)

    switch (queryType) {
      case 'navigation':
        return await navigationAgent.processQuery(query, language)

      case 'services':
        return await servicesAgent.processQuery(query, language)

      case 'action':
        return await actionAgent.processQuery(query, language)

      case 'information':
      default:
        return await informationAgent.processQuery(query, language)
    }
  }

  /**
   * Detect language from query text
   * Checks for Urdu Unicode characters (U+0600-U+06FF)
   */
  detectLanguage(text: string): Language {
    // Check for Urdu characters (Arabic script Unicode range)
    const urduRegex = /[\u0600-\u06FF]/

    if (urduRegex.test(text)) {
      return 'ur'
    }

    // Default to English
    return 'en'
  }

  /**
   * Classify query to determine which agent should handle it
   */
  private classifyQuery(query: string): 'information' | 'navigation' | 'services' | 'action' {
    const normalizedQuery = query.toLowerCase()

    // Navigation intent patterns
    const navigationPatterns = [
      /where.*is/i,
      /how.*do.*i.*get/i,
      /take.*me.*to/i,
      /show.*me/i,
      /navigate/i,
      /go.*to/i,
      /page/i,
      /کہاں.*ہے/i,
      /کیسے.*جاؤں/i,
    ]

    if (navigationPatterns.some(pattern => pattern.test(normalizedQuery))) {
      return 'navigation'
    }

    // Services intent patterns
    const servicesPatterns = [
      /service/i,
      /\bit\b/i,
      /medical/i,
      /education/i,
      /sport/i,
      /banquet/i,
      /graveyard/i,
      /course/i,
      /program/i,
      /خدمات/i,
      /کورس/i,
    ]

    if (servicesPatterns.some(pattern => pattern.test(normalizedQuery))) {
      return 'services'
    }

    // Action intent patterns
    const actionPatterns = [
      /how.*can.*i/i,
      /want.*to/i,
      /need.*to/i,
      /enroll/i,
      /register/i,
      /contact/i,
      /inquir/i,
      /feedback/i,
      /donat/i,
      /submit/i,
      /fill.*form/i,
      /رابطہ/i,
      /استفسار/i,
      /عطیہ/i,
    ]

    if (actionPatterns.some(pattern => pattern.test(normalizedQuery))) {
      return 'action'
    }

    // Default to information
    return 'information'
  }

  /**
   * Get greeting message based on language
   */
  getGreeting(language: Language): string {
    if (language === 'ur') {
      return 'السلام علیکم! میں تنظیم خواجگان کا AI اسسٹنٹ ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟'
    }

    return 'Hello! I am the AI assistant for Tanzeem-e-Khawajgan. How can I help you today?'
  }
}

export const mainAgent = new MainAgent()
