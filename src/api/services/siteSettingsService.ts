import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { SiteSettingsRequestDto, SiteSettingsResponseDto } from '../../types/portalDtos'

export const siteSettingsService = {
  // Get Admin Site Settings
  getSettings: async (): Promise<SiteSettingsResponseDto> => {
    const response = await api.get<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.BASE)
    return response.data
  },

  // Update Admin Site Settings
  updateSettings: async (data: SiteSettingsRequestDto): Promise<SiteSettingsResponseDto> => {
    const response = await api.put<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.BASE, data)
    return response.data
  },
}
