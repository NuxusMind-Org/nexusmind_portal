import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  currentTenantId: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setTokens: (token: string | null, refreshToken?: string | null) => void
  setTenantId: (tenantId: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      currentTenantId: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setTokens: (token, refreshToken = null) =>
        set((state) => ({
          token,
          refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
          isAuthenticated: !!token,
        })),
      setTenantId: (currentTenantId) => set({ currentTenantId }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          currentTenantId: null,
        }),
    }),
    {
      name: 'nexusmind-auth',
    }
  )
)

