export const ROUTES = {
  LANDING: '/',
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: '/dashboard',
  PLATFORM: {
    ORGANIZATIONS: '/platform/organizations',
    ANALYTICS: '/platform/analytics',
  },
  ORGANIZATION: {
    USERS: '/org/users',
    SETTINGS: '/org/settings',
  },
  PSYCHOLOGIST: {
    PATIENTS: '/psy/patients',
    SESSIONS: '/psy/sessions',
  },
  PATIENT: {
    PORTAL: '/patient/portal',
    SESSIONS: '/patient/sessions',
  },
} as const
