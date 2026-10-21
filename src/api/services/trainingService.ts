import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { TrainingRequest, TrainingResponse, TrainingTypeCountResponse, Page } from '../../types/portalDtos'

export const trainingService = {
  searchTrainings: async (params?: { type?: string; search?: string; page?: number; size?: number }): Promise<Page<TrainingResponse>> => {
    const response = await api.get<Page<TrainingResponse>>(API_ENDPOINTS.TRAININGS.BASE, { params })
    return response.data
  },

  createTraining: async (data: TrainingRequest): Promise<TrainingResponse> => {
    const response = await api.post<TrainingResponse>(API_ENDPOINTS.TRAININGS.BASE, data)
    return response.data
  },

  updateTraining: async (id: number | string, data: TrainingRequest): Promise<TrainingResponse> => {
    const response = await api.put<TrainingResponse>(API_ENDPOINTS.TRAININGS.BY_ID(id), data)
    return response.data
  },

  deleteTraining: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRAININGS.BY_ID(id))
  },

  registerForTraining: async (id: number | string): Promise<void> => {
    await api.post(API_ENDPOINTS.TRAININGS.REGISTER(id))
  },

  unregisterFromTraining: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRAININGS.REGISTER(id))
  },

  // Get training type counts (GET /trainings/type-counts)
  getTypeCounts: async (): Promise<TrainingTypeCountResponse[]> => {
    const response = await api.get<TrainingTypeCountResponse[]>(API_ENDPOINTS.TRAININGS.TYPE_COUNTS)
    return Array.isArray(response.data) ? response.data : []
  },

  // Get popular training tags (GET /trainings/popular-tags)
  getPopularTags: async (limit: number = 10): Promise<string[]> => {
    const response = await api.get<string[]>(API_ENDPOINTS.TRAININGS.POPULAR_TAGS, {
      params: { limit },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  // Get calendar training schedule for a specific month (GET /trainings/calendar)
  getMonthCalendar: async (year: number, month: number): Promise<TrainingResponse[]> => {
    const response = await api.get<TrainingResponse[]>(API_ENDPOINTS.TRAININGS.CALENDAR, {
      params: { year, month },
    })
    return Array.isArray(response.data) ? response.data : []
  },
}
