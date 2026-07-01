import { useUserStore } from '../store/userStore'
import type { PermissionType } from './permissions'

export function useHasPermission() {
  const profile = useUserStore((state) => state.profile)

  const hasPermission = (permission: PermissionType): boolean => {
    if (!profile) return false
    if (profile.role === 'platform_admin') return true
    return profile.permissions.includes(permission)
  }

  return { hasPermission }
}
