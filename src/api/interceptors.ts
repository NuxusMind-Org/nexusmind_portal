import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

/**
 * Triggers a token refresh using the stored refreshToken.
 * Queues concurrent calls and prevents multiple simultaneous refresh requests.
 */
export async function refreshAccessToken(baseURL?: string): Promise<string> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  const { refreshToken, setTokens, logout } = useAuthStore.getState()
  if (!refreshToken) {
    logout()
    throw new Error('No refresh token available')
  }

  isRefreshing = true

  const apiBaseUrl =
    baseURL ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://nexusmind-889936615032.europe-west3.run.app'

  try {
    const response = await axios.post<{
      id?: number
      token?: string
      accessToken?: string
      refreshToken?: string
    }>(
      `${apiBaseUrl}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )

    const newToken = response.data.token || response.data.accessToken
    const newRefreshToken = response.data.refreshToken || refreshToken

    if (!newToken) {
      throw new Error('Server returned empty token on refresh')
    }

    setTokens(newToken, newRefreshToken)
    processQueue(null, newToken)
    return newToken
  } catch (error) {
    processQueue(error, null)
    logout()
    throw error
  } finally {
    isRefreshing = false
  }
}

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

      // If data is FormData, remove hardcoded Content-Type so browser sets boundary automatically
      if (config.data instanceof FormData && config.headers) {
        delete config.headers['Content-Type']
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Don't retry if already retried or if this was the refresh call itself
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh')
      ) {
        originalRequest._retry = true
        try {
          const newToken = await refreshAccessToken(axiosInstance.defaults.baseURL)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}

