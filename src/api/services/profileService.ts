import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  UpdateProfileStatusRequest,
  ChangePasswordRequest,
  UpdateNameRequest,
  UpdateLanguageRequest,
  UpdateEmailRequest,
  ProfileResponse,
} from '../../types/portalDtos'

export const profileService = {
  // Update Profile Status
  updateStatus: async (data: UpdateProfileStatusRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.STATUS, data)
    return response.data
  },

  // Change Profile Password
  changePassword: async (data: ChangePasswordRequest): Promise<string> => {
    const response = await api.put<string>(API_ENDPOINTS.PROFILE.PASSWORD, data)
    return response.data
  },

  // Update Profile Name
  updateName: async (data: UpdateNameRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.NAME, data)
    return response.data
  },

  // Update Profile Language
  updateLanguage: async (data: UpdateLanguageRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.LANGUAGE, data)
    return response.data
  },

  // Update Profile Email
  updateEmail: async (data: UpdateEmailRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.EMAIL, data)
    return response.data
  },

  // Enable/Disable 2FA
  updateTwoFactor: async (enabled: boolean): Promise<string> => {
    const response = await api.put<string>(API_ENDPOINTS.PROFILE.TWO_FACTOR, null, {
      params: { enabled },
    })
    return response.data
  },

  // Upload Profile Avatar Photo
  uploadPhoto: async (file: File): Promise<ProfileResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<ProfileResponse>(API_ENDPOINTS.PROFILE.PHOTO, formData)
    return response.data
  },

  // Delete Profile Avatar Photo
  deletePhoto: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.PROFILE.PHOTO)
  },
}
