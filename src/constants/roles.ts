export const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  ORG_ADMIN: 'org_admin',
  PSYCHOLOGIST: 'psychologist',
  PATIENT: 'patient',
} as const

export type RoleType = typeof ROLES[keyof typeof ROLES]
