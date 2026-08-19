import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { DoctorRegisterDto, SaveScheduleRequest, WorkingHoursResponse } from '../../types/portalDtos'

export const doctorService = {
  // Register Doctor / Psychologist
  registerDoctor: async (data: DoctorRegisterDto): Promise<string> => {
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('specialization', data.specialization)
    if (data.phone) {
      formData.append('phone', data.phone)
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
  saveMyWorkingHours: async (data: SaveScheduleRequest): Promise<void> => {
    await api.post(API_ENDPOINTS.DOCTORS.WORKING_HOURS_ME, data)
  },
}
