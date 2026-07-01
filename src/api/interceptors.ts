import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = useAuthStore.getState()
      
      if (state.token && config.headers) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
      
      if (state.currentTenantId && config.headers) {
        config.headers['X-Tenant-ID'] = state.currentTenantId
      }
      
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          // Token refresh flow logic placeholder
        } catch (refreshError) {
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        }
      }
      
      return Promise.reject(error)
    }
  )
}
