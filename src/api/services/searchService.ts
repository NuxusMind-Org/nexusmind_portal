import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  JournalEntryResponse,
  DoctorSearchResult,
  ContentSearchResult,
} from '../../types/portalDtos'

export const searchService = {
  // Search journal entries (GET /search/journal?q&page&size)
  searchJournal: async (
    q: string,
    page: number = 0,
    size: number = 10
  ): Promise<JournalEntryResponse[]> => {
    const response = await api.get<JournalEntryResponse[]>(API_ENDPOINTS.SEARCH.JOURNAL, {
      params: { q, page, size },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  // Search doctors (GET /search/doctors?q&lang)
  searchDoctors: async (q: string, lang: string = 'az'): Promise<DoctorSearchResult[]> => {
    const response = await api.get<DoctorSearchResult[]>(API_ENDPOINTS.SEARCH.DOCTORS, {
      params: { q, lang },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  // Search content across news, articles, blogs (GET /search/content?q&lang&page&size)
  searchContent: async (
    q: string,
    lang: string = 'az',
    page: number = 0,
    size: number = 10
  ): Promise<ContentSearchResult[]> => {
    const response = await api.get<ContentSearchResult[]>(API_ENDPOINTS.SEARCH.CONTENT, {
      params: { q, lang, page, size },
    })
    return Array.isArray(response.data) ? response.data : []
  },
}
