import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  PatientDto,
  PasientRegisterEntity,
  DoctorEntity,
  DoctorResponseDto,
  PageableParams,
} from '../../types/portalDtos'

/**
 * Normalizes backend responses that may return either a direct JSON Array `T[]`
 * or a Spring Data Page object `{ content: T[] }`.
 */
function normalizeListResponse<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[]
  }
  if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as { content: unknown[] }).content)) {
    return (data as { content: T[] }).content
  }
  return []
}

export const orgAdminService = {
  // --- NEXUSMIND SUPER ADMIN ENDPOINTS (super-admin-controller) ---
  getNexusmindPatients: async (params?: PageableParams): Promise<PatientDto[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.NEXUSMIND_ADMIN.PATIENTS, { params })
    return normalizeListResponse<PatientDto>(response.data)
  },

  getNexusmindDoctors: async (params?: PageableParams): Promise<DoctorEntity[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.NEXUSMIND_ADMIN.DOCTORS, { params })
    return normalizeListResponse<DoctorEntity>(response.data)
  },

  deleteDoctorByNexusmindAdmin: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.NEXUSMIND_ADMIN.DELETE_DOCTOR(id))
  },

  // --- BPM ORGANIZATION ADMIN ENDPOINTS (bpm-controller) ---
  getBpmPatients: async (params?: PageableParams): Promise<PasientRegisterEntity[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.BPM_ADMIN.PATIENTS, { params })
    return normalizeListResponse<PasientRegisterEntity>(response.data)
  },

  getBpmDoctors: async (params?: PageableParams): Promise<DoctorResponseDto[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.BPM_ADMIN.DOCTORS, { params })
    return normalizeListResponse<DoctorResponseDto>(response.data)
  },
}
