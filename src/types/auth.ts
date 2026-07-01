import type { RoleType } from '../constants/roles'

export interface User {
  id: string
  email: string
  name: string
  role: RoleType
  permissions: string[]
  tenantId: string | null
}

export interface AuthResponse {
  token: string
  user: User
}
