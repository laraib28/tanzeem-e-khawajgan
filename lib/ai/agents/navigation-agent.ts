import type { AgentResponse, Language } from '../types'

/**
 * Navigation Agent
 * Helps users navigate to specific pages and sections
 * Provides links and guidance for website navigation
 */

export class NavigationAgent {
  /**
   * Process a navigation query
   */
  async processQuery(query: string, language: Language): Promise<AgentResponse> {
    const normalizedQuery = query.toLowerCase()

    // Check for page navigation requests
    if (this.isHomeRequest(normalizedQuery)) {
      return this.navigateToHome(language)
    }

    if (this.isAboutRequest(normalizedQuery)) {
      return this.navigateToAbout(language)
    }

    if (this.isMissionRequest(normalizedQuery)) {
      return this.navigateToMission(language)
    }

    if (this.isBoardRequest(normalizedQuery)) {
      return this.navigateToBoard(language)
    }

    if (this.isNewsRequest(normalizedQuery)) {
      return this.navigateToNews(language)
    }

    if (this.isServicesRequest(normalizedQuery)) {
      return this.navigateToServices(language)
    }

    if (this.isContactRequest(normalizedQuery)) {
      return this.navigateToContact(language)
    }

    // Default navigation help
    return this.getNavigationHelp(language)
  }

  private isHomeRequest(query: string): boolean {
    const patterns = [/home/i, /main.*page/i, /گھر/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isAboutRequest(query: string): boolean {
    const patterns = [/about/i, /کے.*بارے/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isMissionRequest(query: string): boolean {
    const patterns = [/mission/i, /vision/i, /مقصد/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isBoardRequest(query: string): boolean {
    const patterns = [/board/i, /member/i, /committee/i, /ممبر/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isNewsRequest(query: string): boolean {
    const patterns = [/news/i, /event/i, /خبریں/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isServicesRequest(query: string): boolean {
    const patterns = [/service/i, /خدمات/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private isContactRequest(query: string): boolean {
    const patterns = [/contact/i, /رابطہ/i]
    return patterns.some(pattern => pattern.test(query))
  }

  private navigateToHome(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'آپ ہوم پیج پر جانے کے لیے یہاں کلک کریں: /'
        : 'You can go to the home page here: /'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/', pageName: 'Home' },
    }
  }

  private navigateToAbout(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہمارے بارے میں مزید جاننے کے لیے یہاں کلک کریں: /about'
        : 'Learn more about us here: /about'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/about', pageName: 'About' },
    }
  }

  private navigateToMission(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہمارا مشن دیکھنے کے لیے یہاں کلک کریں: /vision/mission'
        : 'See our mission here: /vision/mission'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/vision/mission', pageName: 'Mission' },
    }
  }

  private navigateToBoard(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'بورڈ ممبرز دیکھنے کے لیے یہاں کلک کریں: /vision/board-members'
        : 'View our board members here: /vision/board-members'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/vision/board-members', pageName: 'Board of Members' },
    }
  }

  private navigateToNews(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'خبریں اور ایونٹس دیکھنے کے لیے یہاں کلک کریں: /vision/news-events'
        : 'See news and events here: /vision/news-events'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/vision/news-events', pageName: 'News & Events' },
    }
  }

  private navigateToServices(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہماری خدمات دیکھنے کے لیے سروسز مینو استعمال کریں۔'
        : 'Use the Services menu to explore our services (IT, Medical, Education, Sports, Banquets, Graveyard).'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { category: 'services' },
    }
  }

  private navigateToContact(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'ہم سے رابطہ کرنے کے لیے یہاں کلک کریں: /contact'
        : 'Contact us here: /contact'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
      metadata: { page: '/contact', pageName: 'Contact' },
    }
  }

  private getNavigationHelp(language: Language): AgentResponse {
    const message =
      language === 'ur'
        ? 'میں آپ کو ویب سائٹ پر نیویگیٹ کرنے میں مدد کر سکتا ہوں۔ آپ ہوم، اباؤٹ، مشن، خدمات، یا رابطہ صفحات پر جا سکتے ہیں۔'
        : 'I can help you navigate the website. You can visit pages like Home, About, Mission, Services, or Contact. What would you like to see?'

    return {
      success: true,
      message,
      language,
      agentType: 'navigation',
    }
  }
}

export const navigationAgent = new NavigationAgent()
