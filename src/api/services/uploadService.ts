import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { FileUploadResponse } from '../../types/portalDtos'

export const uploadService = {
  /**
   * Upload a file with an optional folder category (e.g. news, blogs, articles, gallery)
   * @param file The File object to upload
   * @param folder The destination folder/category (news, blogs, articles, gallery, etc.)
   * @returns Promise<FileUploadResponse> containing the uploaded imageUrl
   */
  uploadFile: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<FileUploadResponse>(API_ENDPOINTS.UPLOAD.BASE, formData, {
      params: folder ? { folder } : undefined,
    })
    return response.data
  },
}
