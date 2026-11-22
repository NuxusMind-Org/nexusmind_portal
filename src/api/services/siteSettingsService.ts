import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { SiteSettingsResponseDto } from '../../types/portalDtos'

export const siteSettingsService = {
  // Get Site Settings / Public Scripts (GET /site-settings/scripts — read-only in Swagger v1.0)
  getSettings: async (): Promise<SiteSettingsResponseDto> => {
    const response = await api.get<SiteSettingsResponseDto>(API_ENDPOINTS.SITE_SETTINGS.SCRIPTS)
    return response.data
  },
}
