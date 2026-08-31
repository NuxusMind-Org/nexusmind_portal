import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { PatientDto, DoctorDto, PageableParams } from '../../types/portalDtos'

/**
 * Normalizes backend responses that may return either a direct JSON Array `T[]`
 * or a Spring Data Page object `{ content: T[] }`.
 */
function normalizeListResponse<T>(data: any): T[] {
  if (Array.isArray(data)) {
    return data
  }
  if (data && Array.isArray(data.content)) {
    return data.content
  }
  return []
}

export const orgAdminService = {
  // --- NEXUSMIND PLATFORM ADMIN ENDPOINTS ---
  getNexusmindPatients: async (params?: PageableParams): Promise<PatientDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.NEXUSMIND_ADMIN.PATIENTS, { params })
    return normalizeListResponse<PatientDto>(response.data)
  },

  getNexusmindDoctors: async (params?: PageableParams): Promise<DoctorDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.NEXUSMIND_ADMIN.DOCTORS, { params })
    return normalizeListResponse<DoctorDto>(response.data)
  },

  deleteDoctorByNexusmindAdmin: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.NEXUSMIND_ADMIN.DELETE_DOCTOR(id))
  },

  deleteBpmOrganizationByNexusmindAdmin: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.NEXUSMIND_ADMIN.DELETE_BPM(id))
  },

  // --- BPM ORGANIZATION ADMIN ENDPOINTS ---
  getBpmPatients: async (params?: PageableParams): Promise<PatientDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.BPM_ADMIN.PATIENTS, { params })
    return normalizeListResponse<PatientDto>(response.data)
  },

  getBpmDoctors: async (params?: PageableParams): Promise<DoctorDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.BPM_ADMIN.DOCTORS, { params })
    return normalizeListResponse<DoctorDto>(response.data)
  },
}
