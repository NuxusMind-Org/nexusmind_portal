export const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  PSYCHOLOGISTS: {
    CREATE: 'psychologists:create',
    READ: 'psychologists:read',
    UPDATE: 'psychologists:update',
    DELETE: 'psychologists:delete',
  },
  PATIENTS: {
    CREATE: 'patients:create',
    READ: 'patients:read',
    UPDATE: 'patients:update',
    DELETE: 'patients:delete',
  },
  SESSIONS: {
    CREATE: 'sessions:create',
    READ: 'sessions:read',
    UPDATE: 'sessions:update',
    CANCEL: 'sessions:cancel',
  },
  ORGANIZATIONS: {
    READ: 'organizations:read',
    UPDATE: 'organizations:update',
    MANAGE: 'organizations:manage',
  },
} as const

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]]
