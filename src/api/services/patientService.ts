import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { PasientRegisterDto, PatientMood } from '../../types/portalDtos'

export const patientService = {
  // Get Patient by ID
  getPatientById: async (id: number | string): Promise<PasientRegisterDto> => {
    const response = await api.get<PasientRegisterDto>(API_ENDPOINTS.AUTH.PATIENT_BY_ID(id))
    return response.data
  },

  // Register New Patient
  addPatient: async (data: PasientRegisterDto): Promise<PasientRegisterDto> => {
    const response = await api.post<PasientRegisterDto>(API_ENDPOINTS.AUTH.ADD_PATIENT, data)
    return response.data
  },

  // Update Patient Profile
  updatePatient: async (id: number | string, data: PasientRegisterDto): Promise<string> => {
    const response = await api.put<string>(API_ENDPOINTS.AUTH.PATIENT_BY_ID(id), data)
    return response.data
  },

  // Delete Patient Profile
  deletePatient: async (id: number | string): Promise<string> => {
    const response = await api.delete<string>(API_ENDPOINTS.AUTH.PATIENT_BY_ID(id))
    return response.data
  },

  // Update Patient Mood
  updateMood: async (patientId: number | string, mood: PatientMood): Promise<void> => {
    await api.put(API_ENDPOINTS.AUTH.PATIENT_MOOD(patientId), null, {
      params: { mood },
    })
  },
}
