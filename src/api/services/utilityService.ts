import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  OnboardingRequest,
  OnboardingResponse,
  JournalEntryRequest,
  JournalEntryResponse,
  Page,
} from '../../types/portalDtos'

export const utilityService = {
  // --- ONBOARDING ---
  submitOnboarding: async (data: OnboardingRequest): Promise<OnboardingResponse> => {
    const response = await api.post<OnboardingResponse>(API_ENDPOINTS.ONBOARDING.SUBMIT, data)
    return response.data
  },

  getOnboardingStatus: async (): Promise<boolean> => {
    const response = await api.get<boolean>(API_ENDPOINTS.ONBOARDING.STATUS)
    return Boolean(response.data)
  },

  getMyOnboarding: async (): Promise<OnboardingResponse> => {
    const response = await api.get<OnboardingResponse>(API_ENDPOINTS.ONBOARDING.ME)
    return response.data
  },

  // --- JOURNAL ---
  saveJournalToday: async (data: JournalEntryRequest): Promise<JournalEntryResponse> => {
    const response = await api.post<JournalEntryResponse>(API_ENDPOINTS.JOURNAL.SAVE_TODAY, data)
    return response.data
  },

  getJournalToday: async (): Promise<JournalEntryResponse> => {
    const response = await api.get<JournalEntryResponse>(API_ENDPOINTS.JOURNAL.TODAY)
    return response.data
  },

  getJournalHistory: async (page: number = 0, size: number = 10): Promise<Page<JournalEntryResponse>> => {
    const response = await api.get<Page<JournalEntryResponse>>(API_ENDPOINTS.JOURNAL.HISTORY, {
      params: { page, size },
    })
    return response.data
  },

  getJournalById: async (id: number | string): Promise<JournalEntryResponse> => {
    const response = await api.get<JournalEntryResponse>(API_ENDPOINTS.JOURNAL.BY_ID(id))
    return response.data
  },

  deleteJournalEntry: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.JOURNAL.BY_ID(id))
  },
}
