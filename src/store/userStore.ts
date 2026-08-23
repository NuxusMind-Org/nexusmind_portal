import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  tenantId: string | null
  doctorId?: number
}

interface UserState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'nexusmind-user-profile',
    }
  )
)
