import type { RoleType } from '../../../constants/roles'
import type { PermissionType } from '../../../permissions/permissions'

export interface MockUserProfile {
  id: string
  name: string
  email: string
  role: RoleType
  permissions: PermissionType[]
  tenantId: string | null
}

export interface MockUser {
  profile: MockUserProfile
  token: string
}

export const MOCK_USERS: Record<string, MockUser> = {
  'superadmin@nexusmind.com': {
    token: 'mock-jwt-super-admin-token-112233',
    profile: {
      id: 'user_super_001',
      name: 'Arthur Pendragon',
      email: 'superadmin@nexusmind.com',
      role: 'platform_admin',
      permissions: [], // Platform admins override permission checks
      tenantId: null,
    },
  },
  'orgadmin@nexusmind.com': {
    token: 'mock-jwt-org-admin-token-445566',
    profile: {
      id: 'user_org_002',
      name: 'Sarah Connor',
      email: 'orgadmin@nexusmind.com',
      role: 'org_admin',
      permissions: [
        'users:read',
        'users:create',
        'users:update',
        'users:delete',
        'organizations:read',
        'organizations:update',
      ] as PermissionType[],
      tenantId: 'tenant_bpm_counseling_01',
    },
  },
  'psychologist@nexusmind.com': {
    token: 'mock-jwt-psychologist-token-778899',
    profile: {
      id: 'user_psy_003',
      name: 'Dr. Mercer',
      email: 'psychologist@nexusmind.com',
      role: 'psychologist',
      permissions: [
        'patients:read',
        'patients:create',
        'patients:update',
        'sessions:read',
        'sessions:create',
        'sessions:update',
        'sessions:cancel',
      ] as PermissionType[],
      tenantId: 'tenant_bpm_counseling_01',
    },
  },
}
