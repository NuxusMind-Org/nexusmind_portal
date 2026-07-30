import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  OnboardingRequest,
  OnboardingResponse,
  JournalEntryRequest,
  JournalEntryResponse,
} from '../../types/portalDtos'

export const utilityService = {
  // Submit Onboarding Answers
  submitOnboarding: async (data: OnboardingRequest): Promise<OnboardingResponse> => {
    const response = await api.post<OnboardingResponse>(API_ENDPOINTS.ONBOARDING.SUBMIT, data)
    return response.data
  },

  // Save Today's Journal Entry
  saveJournalToday: async (data: JournalEntryRequest): Promise<JournalEntryResponse> => {
    const response = await api.post<JournalEntryResponse>(API_ENDPOINTS.JOURNAL.SAVE_TODAY, data)
    return response.data
  },
}
