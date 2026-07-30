import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { DoctorRegisterDto } from '../../types/portalDtos'

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
}
