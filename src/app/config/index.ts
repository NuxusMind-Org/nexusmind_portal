export const APP_CONFIG = {
  env: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  wsUrl: import.meta.env.VITE_WS_URL || '',
  siteName: 'NexusMind Portal',
} as const
