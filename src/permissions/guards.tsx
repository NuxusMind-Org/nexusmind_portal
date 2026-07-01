import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useUserStore } from '../store/userStore'
import type { RoleType } from '../constants/roles'
import type { PermissionType } from './permissions'
import { useHasPermission } from './hasPermission'

export function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

interface RoleGuardProps {
  allowedRoles: RoleType[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const profile = useUserStore((state) => state.profile)

  if (!profile) return <Navigate to="/login" replace />
  
  const hasRole = allowedRoles.includes(profile.role as RoleType)
  return hasRole ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

interface PermissionGuardProps {
  permission: PermissionType
}

export function PermissionGuard({ permission }: PermissionGuardProps) {
  const { hasPermission } = useHasPermission()
  return hasPermission(permission) ? <Outlet /> : <Navigate to="/unauthorized" replace />
}
