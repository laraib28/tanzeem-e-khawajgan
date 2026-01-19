import type { Language } from './config'

/**
 * Detects language based on Unicode ranges
 * Urdu Unicode range: U+0600-U+06FF (Arabic script)
 */
export function detectLanguage(text: string): Language {
  // Check for Urdu characters (Arabic script Unicode range)
  const urduRegex = /[\u0600-\u06FF]/

  if (urduRegex.test(text)) {
    return 'ur'
  }

  // Default to English
  return 'en'
}

/**
 * Get text direction based on language
 */
export function getTextDirection(language: Language): 'ltr' | 'rtl' {
  return language === 'ur' ? 'rtl' : 'ltr'
}
