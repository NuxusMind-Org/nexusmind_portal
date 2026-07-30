import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { TrainingRequest, TrainingResponse, Page } from '../../types/portalDtos'

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
}
