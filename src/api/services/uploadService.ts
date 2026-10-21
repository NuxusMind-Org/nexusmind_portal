import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { FileUploadResponse } from '../../types/portalDtos'

export const uploadService = {
  /**
   * Upload a file with an optional folder category (e.g. news, blogs, articles, gallery)
   * Normalizes both raw string URLs and structured { imageUrl: string } responses.
   * @param file The File object to upload
   * @param folder The destination folder/category (news, blogs, articles, gallery, etc.)
   * @returns Promise<FileUploadResponse> containing the uploaded imageUrl
   */
  uploadFile: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<string | FileUploadResponse>(API_ENDPOINTS.UPLOAD.BASE, formData, {
      params: folder ? { folder } : undefined,
    })
    
    // Normalize response: if backend returns a direct URL string, wrap it
    if (typeof response.data === 'string') {
      return { imageUrl: response.data }
    }
    return response.data || { imageUrl: '' }
  },

  /**
   * Download a file from server by filename (GET /upload/{filename})
   */
  downloadFile: async (filename: string): Promise<Blob> => {
    const response = await api.get(API_ENDPOINTS.UPLOAD.BY_FILENAME(filename), {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Delete a file from server by filename (DELETE /upload/{filename})
   */
  deleteFile: async (filename: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.UPLOAD.BY_FILENAME(filename))
  },
}
