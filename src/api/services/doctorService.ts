import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  DoctorRegisterDto,
  SaveScheduleRequest,
  SaveWeeklyTemplateRequest,
  WorkingHoursResponse,
  PasientRegisterEntity,
} from '../../types/portalDtos'

export const doctorService = {
  // Register Doctor / Psychologist
  registerDoctor: async (data: DoctorRegisterDto): Promise<string> => {
    const formData = new FormData()
    if (data.fullName) {
      formData.append('fullName', data.fullName)
    }
    if (data.name) formData.append('name', data.name)
    if (data.surname) formData.append('surname', data.surname)
    if (data.fatherName) formData.append('fatherName', data.fatherName)
    if (data.email) formData.append('email', data.email)
    if (data.password) formData.append('password', data.password)
    if (data.specialization) formData.append('specialization', data.specialization)
    if (data.age) formData.append('age', String(data.age))
    if (data.phone) formData.append('phone', data.phone)
    if (data.cv) {
      if (typeof data.cv === 'string') {
        formData.append('cv', data.cv)
      } else {
        formData.append('file', data.cv)
      }
    }

    const response = await api.post<string>(API_ENDPOINTS.DOCTORS.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get My Working Hours template (repeating weekly schedule).
  // Normalizes both response shapes: raw array OR { days: [...] } object.
  getMyWorkingHours: async (): Promise<WorkingHoursResponse> => {
    const response = await api.get<unknown>(API_ENDPOINTS.DOCTORS.WORKING_HOURS_ME)
    const data = response.data

    if (Array.isArray(data)) {
      // Backend returned the array directly
      return { days: data as WorkingHoursResponse['days'] }
    }
    if (data && typeof data === 'object' && 'days' in data && Array.isArray((data as WorkingHoursResponse).days)) {
      // Backend returned { days: [...] }
      return data as WorkingHoursResponse
    }
    // Fallback: empty schedule
    return { days: [] }
  },

  // Save My Working Hours
  saveMyWorkingHours: async (data: SaveScheduleRequest | SaveWeeklyTemplateRequest): Promise<void> => {
    await api.post(API_ENDPOINTS.DOCTORS.WORKING_HOURS_ME, data)
  },

  // Get Assigned Patients for currently authenticated doctor (GET /doctors/me/patients)
  getMyPatients: async (): Promise<PasientRegisterEntity[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.DOCTORS.ME_PATIENTS)
    const data = response.data

    if (Array.isArray(data)) {
      return data as PasientRegisterEntity[]
    }
    if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as { content: unknown[] }).content)) {
      return (data as { content: PasientRegisterEntity[] }).content
    }
    return []
  },

  // Upload Doctor Profile Image (POST /appointments/doctors/me/profile-image)
  uploadProfileImage: async (file: File): Promise<Record<string, string>> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<Record<string, string>>(
      API_ENDPOINTS.APPOINTMENTS.PROFILE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },
}
