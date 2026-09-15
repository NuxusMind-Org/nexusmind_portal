import { ROLES, type RoleType } from '../constants/roles'

/**
 * Resolves the primary initial/panel route for a given user role.
 */
export function getInitialRouteForRole(role?: RoleType | string | null): string {
  switch (role) {
    case ROLES.PSYCHOLOGIST:
      return '/psy'
    case ROLES.ORG_ADMIN:
    case ROLES.PLATFORM_ADMIN:
      return '/dashboard'
    case ROLES.PATIENT:
      return '/patient/portal'
    default:
      return '/dashboard'
  }
}
