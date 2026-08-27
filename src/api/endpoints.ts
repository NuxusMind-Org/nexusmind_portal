export const API_ENDPOINTS = {
  AUTH: {
    SUPER_ADMIN_LOGIN: '/auth/super-admin-login',
    BPM_LOGIN: '/auth/bpm-login',
    DOCTOR_LOGIN: '/auth/doctor-login',
    DOCTOR_PANEL_LOGIN: '/auth/doctor-panel-login',
    PATIENT_LOGIN: '/auth/login',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ADD_PATIENT: '/auth/add',
    PATIENT_BY_ID: (id: number | string) => `/auth/${id}`,
    PATIENT_MOOD: (patientId: number | string) => `/auth/${patientId}/mood`,
  },
  XEBER: {
    BASE: '/xeber',
    BY_ID: (id: number | string) => `/xeber/${id}`,
  },
  MEQALE: {
    BASE: '/meqale',
    BY_ID: (id: number | string) => `/meqale/${id}`,
  },
  BLOG: {
    BASE: '/blog',
    BY_ID: (id: number | string) => `/blog/${id}`,
  },
  GALLERY: {
    BASE: '/gallery',
    BY_ID: (id: number | string) => `/gallery/${id}`,
  },
  TRAININGS: {
    BASE: '/trainings',
    BY_ID: (id: number | string) => `/trainings/${id}`,
    REGISTER: (id: number | string) => `/trainings/${id}/register`,
  },
  NEXUSMIND_ADMIN: {
    PATIENTS: '/nexusmind/patients',
    DOCTORS: '/nexusmind/doctors',
    DELETE_DOCTOR: (id: number | string) => `/nexusmind/doctors/${id}`,
    DELETE_BPM: (id: number | string) => `/nexusmind/bpm/${id}`,
  },
  BPM_ADMIN: {
    PATIENTS: '/bpm/patients',
    DOCTORS: '/bpm/doctors',
  },
  DOCTORS: {
    REGISTER: '/doctors/register',
    WORKING_HOURS_ME: '/doctors/me/working-hours/template',
    WORKING_HOURS_AVAILABLE: (doctorId: number | string) => `/doctors/${doctorId}/working-hours/available`,
  },
  PROFILE: {
    STATUS: '/profile/status',
    PASSWORD: '/profile/password',
    NAME: '/profile/name',
    LANGUAGE: '/profile/language',
    EMAIL: '/profile/email',
    TWO_FACTOR: '/profile/2fa',
    PHOTO: '/profile/photo',
  },
  SITE_SETTINGS: {
    BASE: '/admin/site-settings',
  },
  OTP: {
    VERIFY: '/otp/verify',
  },
  ONBOARDING: {
    SUBMIT: '/onboarding/submit',
  },
  JOURNAL: {
    SAVE_TODAY: '/journal',
  },
  SEO: {
    SCRIPTS: '/seo/scripts',
    ROBOTS: '/seo/robots',
    SITEMAP: '/seo/sitemap',
    LLMS: '/seo/llms',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: number | string) => `/appointments/${id}`,
    STATUS: (id: number | string) => `/appointments/${id}/status`,
    CANCEL: (id: number | string) => `/appointments/${id}/cancel`,
    NOTES: (id: number | string) => `/appointments/${id}/notes`,
    JOIN_TOKEN: (id: number | string) => `/appointments/${id}/join-token`,
    STATS: '/appointments/stats',
  },
  CHAT: {
    MESSAGES: (appointmentId: number | string) => `/chat/${appointmentId}/messages`,
  },
} as const


