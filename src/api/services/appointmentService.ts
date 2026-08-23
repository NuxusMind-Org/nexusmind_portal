import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  AppointmentDto,
  CreateAppointmentRequest,
  UpdateUserStatusRequest,
  SessionNoteDto,
  CreateSessionNoteRequest,
  AppointmentStatsDto,
} from '../../types/portalDtos'

export const appointmentService = {
  // Get sessions/appointments for a psychologist by their psychologist ID using GET /appointments/{id}
  getAppointmentsByPsychologistId: async (
    psychologistId: number | string
  ): Promise<AppointmentDto[]> => {
    const numericId =
      typeof psychologistId === 'number'
        ? psychologistId
        : parseInt(String(psychologistId), 10) || 1

    const response = await api.get<unknown>(API_ENDPOINTS.APPOINTMENTS.BY_ID(numericId))
    const data = response.data

    if (Array.isArray(data)) {
      return data as AppointmentDto[]
    }
    if (data && typeof data === 'object') {
      // If wrapped inside a paginated content array
      if ('content' in data && Array.isArray((data as { content: unknown[] }).content)) {
        return (data as { content: AppointmentDto[] }).content
      }
      // If single appointment object
      return [data as AppointmentDto]
    }
    return []
  },

  // Get specific appointment details by appointment ID
  getAppointmentById: async (id: number | string): Promise<AppointmentDto> => {
    const response = await api.get<AppointmentDto>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id))
    return response.data
  },

  // Create a new appointment
  createAppointment: async (data: CreateAppointmentRequest): Promise<AppointmentDto> => {
    const response = await api.post<AppointmentDto>(API_ENDPOINTS.APPOINTMENTS.BASE, data)
    return response.data
  },

  // Web app specific: Get appointments for current user
  getMyAppointments: async (range?: string): Promise<AppointmentDto[]> => {
    const response = await api.get<AppointmentDto[]>(API_ENDPOINTS.APPOINTMENTS.BASE, {
      params: range ? { range } : undefined,
    })
    return Array.isArray(response.data) ? response.data : []
  },

  // Update appointment status
  updateAppointmentStatus: async (
    id: number | string,
    data: UpdateUserStatusRequest
  ): Promise<AppointmentDto> => {
    const response = await api.patch<AppointmentDto>(API_ENDPOINTS.APPOINTMENTS.STATUS(id), data)
    return response.data
  },

  // Cancel an appointment
  cancelAppointment: async (id: number | string): Promise<AppointmentDto> => {
    const response = await api.patch<AppointmentDto>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id))
    return response.data
  },

  // Get session clinical notes
  getAppointmentNotes: async (id: number | string): Promise<SessionNoteDto> => {
    const response = await api.get<SessionNoteDto>(API_ENDPOINTS.APPOINTMENTS.NOTES(id))
    return response.data
  },

  // Add/Update session clinical notes
  addAppointmentNote: async (
    id: number | string,
    data: CreateSessionNoteRequest
  ): Promise<SessionNoteDto> => {
    const response = await api.post<SessionNoteDto>(API_ENDPOINTS.APPOINTMENTS.NOTES(id), data)
    return response.data
  },

  // Get LiveKit join token for virtual room
  getJoinToken: async (id: number | string): Promise<{ token?: string; [key: string]: unknown }> => {
    const response = await api.post<{ token?: string }>(API_ENDPOINTS.APPOINTMENTS.JOIN_TOKEN(id))
    return response.data
  },

  // Get appointment statistics
  getAppointmentStats: async (): Promise<AppointmentStatsDto> => {
    const response = await api.get<AppointmentStatsDto>(API_ENDPOINTS.APPOINTMENTS.STATS)
    return response.data
  },
}
