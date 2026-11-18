import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  DoctorRegisterDto,
  DoctorDto,
  AvailableSlotDto,
  WorkingHourRangeRequest,
  WorkingRangeDto,
  DoctorPriceRequest,
  DoctorPriceResponse,
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

  // Get my working ranges for a date window (GET /doctors/me/working-hours?from&to, dates YYYY-MM-DD)
  getMyWorkingRanges: async (from: string, to: string): Promise<WorkingRangeDto[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.DOCTORS.WORKING_HOURS_ME, {
      params: { from, to },
    })
    const data = response.data
    if (Array.isArray(data)) return data as WorkingRangeDto[]
    if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as { content: unknown[] }).content)) {
      return (data as { content: WorkingRangeDto[] }).content
    }
    return []
  },

  // Add a working range for a specific date (POST /doctors/me/working-hours)
  addMyWorkingRange: async (data: WorkingHourRangeRequest): Promise<void> => {
    await api.post(API_ENDPOINTS.DOCTORS.WORKING_HOURS_ME, data)
  },

  // Delete one of my working ranges (DELETE /doctors/me/working-hours/{rangeId})
  deleteMyWorkingRange: async (rangeId: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.DOCTORS.WORKING_HOURS_RANGE(rangeId))
  },

  // --- Doctor prices (doctor-price-controller) ---

  // GET /doctors/{doctorId}/prices (optional ?age filter)
  getPrices: async (doctorId: number | string, age?: number): Promise<DoctorPriceResponse[]> => {
    const response = await api.get<DoctorPriceResponse[]>(API_ENDPOINTS.DOCTORS.PRICES(doctorId), {
      params: age !== undefined ? { age } : undefined,
    })
    return Array.isArray(response.data) ? response.data : []
  },

  // POST /doctors/{doctorId}/prices -> 201 Created
  createPrice: async (doctorId: number | string, data: DoctorPriceRequest): Promise<DoctorPriceResponse> => {
    const response = await api.post<DoctorPriceResponse>(API_ENDPOINTS.DOCTORS.PRICES(doctorId), data)
    return response.data
  },

  // PUT /doctors/{doctorId}/prices/{priceId}
  updatePrice: async (
    doctorId: number | string,
    priceId: number | string,
    data: DoctorPriceRequest
  ): Promise<DoctorPriceResponse> => {
    const response = await api.put<DoctorPriceResponse>(API_ENDPOINTS.DOCTORS.PRICE_BY_ID(doctorId, priceId), data)
    return response.data
  },

  // DELETE /doctors/{doctorId}/prices/{priceId} -> 204 No Content
  deletePrice: async (doctorId: number | string, priceId: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.DOCTORS.PRICE_BY_ID(doctorId, priceId))
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

  // Get all doctor profiles (GET /doctors)
  getAllDoctorProfiles: async (): Promise<DoctorDto[]> => {
    const response = await api.get<DoctorDto[]>(API_ENDPOINTS.DOCTORS.BASE)
    return Array.isArray(response.data) ? response.data : []
  },

  // Get specific doctor profile by ID (GET /doctors/{id})
  getDoctorProfileById: async (id: number | string): Promise<DoctorDto> => {
    const response = await api.get<DoctorDto>(API_ENDPOINTS.DOCTORS.BY_ID(id))
    return response.data
  },

  // Get available consultation slots for a doctor (GET /doctors/{doctorId}/working-hours/available)
  getAvailableSlots: async (
    doctorId: number | string,
    from: string,
    to: string
  ): Promise<AvailableSlotDto[]> => {
    const response = await api.get<AvailableSlotDto[]>(
      API_ENDPOINTS.DOCTORS.WORKING_HOURS_AVAILABLE(doctorId),
      { params: { from, to } }
    )
    return Array.isArray(response.data) ? response.data : []
  },
}
