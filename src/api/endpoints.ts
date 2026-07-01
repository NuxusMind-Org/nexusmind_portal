export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  TENANTS: {
    BASE: '/organizations',
    DETAIL: (id: string) => `/organizations/${id}`,
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },
  PATIENTS: {
    BASE: '/patients',
    DETAIL: (id: string) => `/patients/${id}`,
  },
  PSYCHOLOGISTS: {
    BASE: '/psychologists',
    DETAIL: (id: string) => `/psychologists/${id}`,
  },
  SESSIONS: {
    BASE: '/sessions',
    DETAIL: (id: string) => `/sessions/${id}`,
  },
} as const
