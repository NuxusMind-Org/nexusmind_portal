import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type {
  XeberRequestDto,
  XeberResponseDto,
  MeqaleRequestDto,
  MeqaleResponseDto,
  BlogRequest,
  BlogResponse,
  GalleryItemRequest,
  GalleryItemResponse,
  PageableParams,
} from '../../types/portalDtos'

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

export const contentService = {
  // --- XEBER (NEWS) ---
  getAllXeber: async (params?: PageableParams): Promise<XeberResponseDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.XEBER.BASE, { params })
    return normalizeListResponse<XeberResponseDto>(response.data)
  },
  getXeberById: async (id: number | string): Promise<XeberResponseDto> => {
    const response = await api.get<XeberResponseDto>(API_ENDPOINTS.XEBER.BY_ID(id))
    return response.data
  },
  createXeber: async (data: XeberRequestDto): Promise<XeberResponseDto> => {
    const response = await api.post<XeberResponseDto>(API_ENDPOINTS.XEBER.BASE, data)
    return response.data
  },
  updateXeber: async (id: number | string, data: XeberRequestDto): Promise<XeberResponseDto> => {
    const response = await api.put<XeberResponseDto>(API_ENDPOINTS.XEBER.BY_ID(id), data)
    return response.data
  },
  deleteXeber: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.XEBER.BY_ID(id))
  },

  // --- MEQALE (ARTICLES) ---
  getAllMeqale: async (params?: PageableParams): Promise<MeqaleResponseDto[]> => {
    const response = await api.get<any>(API_ENDPOINTS.MEQALE.BASE, { params })
    return normalizeListResponse<MeqaleResponseDto>(response.data)
  },
  getMeqaleById: async (id: number | string): Promise<MeqaleResponseDto> => {
    const response = await api.get<MeqaleResponseDto>(API_ENDPOINTS.MEQALE.BY_ID(id))
    return response.data
  },
  createMeqale: async (data: MeqaleRequestDto): Promise<MeqaleResponseDto> => {
    const response = await api.post<MeqaleResponseDto>(API_ENDPOINTS.MEQALE.BASE, data)
    return response.data
  },
  updateMeqale: async (id: number | string, data: MeqaleRequestDto): Promise<MeqaleResponseDto> => {
    const response = await api.put<MeqaleResponseDto>(API_ENDPOINTS.MEQALE.BY_ID(id), data)
    return response.data
  },
  deleteMeqale: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.MEQALE.BY_ID(id))
  },

  // --- BLOG ---
  getAllBlogs: async (params?: PageableParams): Promise<BlogResponse[]> => {
    const response = await api.get<any>(API_ENDPOINTS.BLOG.BASE, { params })
    return normalizeListResponse<BlogResponse>(response.data)
  },
  getBlogById: async (id: number | string): Promise<BlogResponse> => {
    const response = await api.get<BlogResponse>(API_ENDPOINTS.BLOG.BY_ID(id))
    return response.data
  },
  createBlog: async (data: BlogRequest): Promise<BlogResponse> => {
    const response = await api.post<BlogResponse>(API_ENDPOINTS.BLOG.BASE, data)
    return response.data
  },
  updateBlog: async (id: number | string, data: BlogRequest): Promise<BlogResponse> => {
    const response = await api.put<BlogResponse>(API_ENDPOINTS.BLOG.BY_ID(id), data)
    return response.data
  },
  deleteBlog: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.BLOG.BY_ID(id))
  },

  // --- GALLERY ---
  getGalleryItems: async (params?: { category?: string; sort?: string; page?: number; size?: number }): Promise<GalleryItemResponse[]> => {
    const response = await api.get<any>(API_ENDPOINTS.GALLERY.BASE, { params })
    return normalizeListResponse<GalleryItemResponse>(response.data)
  },
  createGalleryItem: async (data: GalleryItemRequest): Promise<GalleryItemResponse> => {
    const response = await api.post<GalleryItemResponse>(API_ENDPOINTS.GALLERY.BASE, data)
    return response.data
  },
  updateGalleryItem: async (id: number | string, data: GalleryItemRequest): Promise<GalleryItemResponse> => {
    const response = await api.put<GalleryItemResponse>(API_ENDPOINTS.GALLERY.BY_ID(id), data)
    return response.data
  },
  deleteGalleryItem: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.GALLERY.BY_ID(id))
  },
}
