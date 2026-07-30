import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { PatientDto, DoctorDto, PageableParams, Page } from '../../types/portalDtos'

export const orgAdminService = {
  // --- NEXUSMIND PLATFORM ADMIN ENDPOINTS ---
  getNexusmindPatients: async (params?: PageableParams): Promise<Page<PatientDto>> => {
    const response = await api.get<Page<PatientDto>>(API_ENDPOINTS.NEXUSMIND_ADMIN.PATIENTS, { params })
    return response.data
  },

  getNexusmindDoctors: async (params?: PageableParams): Promise<Page<DoctorDto>> => {
    const response = await api.get<Page<DoctorDto>>(API_ENDPOINTS.NEXUSMIND_ADMIN.DOCTORS, { params })
    return response.data
  },

  deleteDoctorByNexusmindAdmin: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.NEXUSMIND_ADMIN.DELETE_DOCTOR(id))
  },

  deleteBpmOrganizationByNexusmindAdmin: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.NEXUSMIND_ADMIN.DELETE_BPM(id))
  },

  // --- BPM ORGANIZATION ADMIN ENDPOINTS ---
  getBpmPatients: async (params?: PageableParams): Promise<Page<PatientDto>> => {
    const response = await api.get<Page<PatientDto>>(API_ENDPOINTS.BPM_ADMIN.PATIENTS, { params })
    return response.data
  },

  getBpmDoctors: async (params?: PageableParams): Promise<Page<DoctorDto>> => {
    const response = await api.get<Page<DoctorDto>>(API_ENDPOINTS.BPM_ADMIN.DOCTORS, { params })
    return response.data
  },
}
