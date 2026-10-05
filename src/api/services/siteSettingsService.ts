import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { SiteSettingsResponseDto } from '../../types/portalDtos'

export const siteSettingsService = {
  // Get Site Settings / Public Scripts (GET /site-settings/scripts)
  getSettings: async (): Promise<SiteSettingsResponseDto> => {
    const response = await api.get<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.SCRIPTS)
    return response.data
  },

  // Update Site Settings Scripts (POST /site-settings/scripts)
  updateSettings: async (data: Partial<SiteSettingsResponseDto>): Promise<SiteSettingsResponseDto> => {
    const response = await api.post<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.SCRIPTS, data)
    return response.data
  },
}
