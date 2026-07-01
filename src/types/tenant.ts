export interface Tenant {
  id: string
  name: string
  domain: string
  status: 'active' | 'suspended' | 'trial'
  createdAt: string
}
