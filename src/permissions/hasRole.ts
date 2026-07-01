import { useUserStore } from '../store/userStore'
import type { RoleType } from '../constants/roles'

export function useHasRole() {
  const profile = useUserStore((state) => state.profile)

  const hasRole = (roles: RoleType | RoleType[]): boolean => {
    if (!profile) return false
    const roleList = Array.isArray(roles) ? roles : [roles]
    return roleList.includes(profile.role as RoleType)
  }

  return { hasRole }
}
