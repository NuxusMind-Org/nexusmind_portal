import type { TitleDto } from '../types/portalDtos'
export type { TitleDto }

export interface MultilingualContent {
  az: string
  en: string
  ru: string
}

export type SupportedLanguage = 'az' | 'en' | 'ru'

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' }
]

/**
 * Safely extracts a localized string from a TitleDto or string.
 * Falls back across preferredLang -> az -> en -> ru -> ''
 */
export function getLocalizedTitle(
  title: TitleDto | string | undefined | null,
  preferredLang: string = 'az'
): string {
  if (!title) return ''
  if (typeof title === 'string') return title
  
  const langKey = preferredLang.toLowerCase() as keyof TitleDto
  if (title[langKey] && title[langKey].trim()) {
    return title[langKey].trim()
  }
  if (title.az && title.az.trim()) return title.az.trim()
  if (title.en && title.en.trim()) return title.en.trim()
  if (title.ru && title.ru.trim()) return title.ru.trim()
  return ''
}

/**
 * Factory for an empty TitleDto
 */
export function createEmptyTitleDto(): TitleDto {
  return { az: '', en: '', ru: '' }
}

/**
 * Factory for empty MultilingualContent
 */
export function createEmptyMultilingualContent(): MultilingualContent {
  return { az: '', en: '', ru: '' }
}

/**
 * Normalizes any existing title (string or TitleDto) into a valid TitleDto
 */
export function normalizeTitleDto(title: TitleDto | string | undefined | null): TitleDto {
  if (!title) return createEmptyTitleDto()
  if (typeof title === 'string') {
    return { az: title, en: '', ru: '' }
  }
  return {
    az: title.az || '',
    en: title.en || '',
    ru: title.ru || ''
  }
}

/**
 * Checks if a TitleDto has the required fields
 */
export function isTitleValid(title: TitleDto, requireAll: boolean = false): boolean {
  if (requireAll) {
    return !!(title.az?.trim() && title.en?.trim() && title.ru?.trim())
  }
  return !!(title.az?.trim() || title.en?.trim() || title.ru?.trim())
}
