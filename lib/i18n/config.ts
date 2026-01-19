export const defaultLanguage = 'en' as const
export const supportedLanguages = ['en', 'ur'] as const

export type Language = typeof supportedLanguages[number]

export const languageNames: Record<Language, string> = {
  en: 'English',
  ur: 'اردو',
}

export const isLanguage = (lang: string): lang is Language => {
  return supportedLanguages.includes(lang as Language)
}
