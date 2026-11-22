import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  EmailNotificationRequest,
  EmailNotificationResponse,
  EmailTemplate,
} from '../../types/portalDtos'

export const notificationService = {
  // Send a templated email notification (POST /api/notifications/email)
  sendEmail: async (data: EmailNotificationRequest): Promise<EmailNotificationResponse> => {
    const response = await api.post<EmailNotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.EMAIL,
      data
    )
    return response.data
  },

  // List available email templates (GET /api/notifications/templates)
  getTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await api.get<EmailTemplate[]>(API_ENDPOINTS.NOTIFICATIONS.TEMPLATES)
    return Array.isArray(response.data) ? response.data : []
  },
}
