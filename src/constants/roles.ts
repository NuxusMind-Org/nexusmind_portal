export const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  ORG_ADMIN: 'org_admin',
  PSYCHOLOGIST: 'psychologist',
  PATIENT: 'patient',
} as const

export type RoleType = typeof ROLES[keyof typeof ROLES]

export function normalizeRole(rawRole?: string): RoleType {
  if (!rawRole) return ROLES.PLATFORM_ADMIN

  const normalized = rawRole.toUpperCase().replace(/^ROLE_/, '')

  if (normalized === 'SUPER_ADMIN' || normalized === 'SUPERADMIN' || normalized === 'PLATFORM_ADMIN') {
    return ROLES.PLATFORM_ADMIN
  }
  if (normalized === 'BPM' || normalized === 'BPM_ADMIN' || normalized === 'ORG_ADMIN') {
    return ROLES.ORG_ADMIN
  }
  if (normalized === 'DOCTOR' || normalized === 'PSYCHOLOGIST') {
    return ROLES.PSYCHOLOGIST
  }
  if (normalized === 'PATIENT' || normalized === 'PASIENT') {
    return ROLES.PATIENT
  }

  return ROLES.PLATFORM_ADMIN
}
