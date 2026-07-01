import type { RoleType } from '../constants/roles'

export interface Role {
  name: RoleType
  displayName: string
  description?: string
  permissions: string[]
}
