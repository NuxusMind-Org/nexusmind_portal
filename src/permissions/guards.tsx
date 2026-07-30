import React from 'react'
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
  children?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const profile = useUserStore((state) => state.profile)

  if (!profile) return <Navigate to="/login" replace />
  
  const hasRole = allowedRoles.includes(profile.role as RoleType)
  if (!hasRole) return <Navigate to="/unauthorized" replace />

  return children ? <>{children}</> : <Outlet />
}

interface PermissionGuardProps {
  permission: PermissionType
  children?: React.ReactNode
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { hasPermission } = useHasPermission()
  if (!hasPermission(permission)) return <Navigate to="/unauthorized" replace />
  return children ? <>{children}</> : <Outlet />
}
