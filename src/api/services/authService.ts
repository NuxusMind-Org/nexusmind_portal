import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  AdminLoginRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
  VerifyOtpRequest,
} from '../../types/portalDtos'

export const authService = {
  // NexusMind Super Admin Login
  superAdminLogin: async (data: AdminLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.SUPER_ADMIN_LOGIN, data)
    return response.data
  },

  // BPM Admin Login
  bpmLogin: async (data: AdminLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.BPM_LOGIN, data)
    return response.data
  },

  // Psychologist / Doctor Login
  doctorLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.DOCTOR_LOGIN, data)
    return response.data
  },

  // Doctor Panel Login
  doctorPanelLogin: async (data: AdminLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.DOCTOR_PANEL_LOGIN, data)
    return response.data
  },

  // Patient Login (NexusMind Web)
  patientLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.PATIENT_LOGIN, data)
    return response.data
  },

  // Change Account Password
  changePassword: async (data: ChangePasswordRequest): Promise<string> => {
    const response = await api.put<string>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
    return response.data
  },

  // Verify OTP
  verifyOtp: async (data: VerifyOtpRequest): Promise<string> => {
    const response = await api.post<string>(API_ENDPOINTS.OTP.VERIFY, data)
    return response.data
  },
}
