import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { ChatMessageResponseDto } from '../../types/portalDtos'

export const chatService = {
  // Fetch messages for a specific appointment session
  getAppointmentMessages: async (
    appointmentId: number | string
  ): Promise<ChatMessageResponseDto[]> => {
    const response = await api.get<ChatMessageResponseDto[]>(
      API_ENDPOINTS.CHAT.MESSAGES(appointmentId)
    )
    return Array.isArray(response.data) ? response.data : []
  },
}
