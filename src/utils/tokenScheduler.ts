import { parseJwt } from './jwt'
import { useAuthStore } from '../store/authStore'
import { refreshAccessToken } from '../api/interceptors'

// Refresh the token 15 minutes before the 24-hour expiration window
const REFRESH_BUFFER_MS = 15 * 60 * 1000

// Default session lifespan if exp claim is not in JWT: 24 hours
const DEFAULT_LIFESPAN_MS = 24 * 60 * 60 * 1000

let refreshTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Calculates time until next required refresh and schedules a timer.
 */
export function scheduleTokenRefresh(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  const { token, refreshToken, isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated || !token || !refreshToken) {
    return
  }

  const claims = parseJwt(token)
  const now = Date.now()

  let expiresAtMs: number
  if (claims?.exp && typeof claims.exp === 'number') {
    expiresAtMs = claims.exp * 1000
  } else {
    expiresAtMs = now + DEFAULT_LIFESPAN_MS
  }

  const timeUntilRefreshMs = expiresAtMs - now - REFRESH_BUFFER_MS

  // If already expired or within the 15-minute buffer, refresh immediately
  if (timeUntilRefreshMs <= 0) {
    refreshAccessToken().catch((err) => {
      console.warn('Immediate proactive token refresh failed:', err)
    })
    return
  }

  // Schedule timer to execute before token expires
  refreshTimer = setTimeout(() => {
    refreshAccessToken().catch((err) => {
      console.warn('Scheduled proactive token refresh failed:', err)
    })
  }, timeUntilRefreshMs)
}

/**
 * Sets up global listeners (store updates, tab visibility, window focus)
 * to keep the token active and renewed.
 */
export function setupTokenRefreshListener(): () => void {
  // 1. Initial schedule check on startup
  scheduleTokenRefresh()

  // 2. React to auth state changes (login, manual refresh, logout)
  let lastToken = useAuthStore.getState().token
  const unsubscribeStore = useAuthStore.subscribe((state) => {
    if (state.token !== lastToken) {
      lastToken = state.token
      scheduleTokenRefresh()
    }
  })

  // 3. Tab visibility handler (e.g. computer wakes up from sleep)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      scheduleTokenRefresh()
    }
  }

  // 4. Window focus handler
  const handleFocus = () => {
    scheduleTokenRefresh()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleFocus)

  return () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
    unsubscribeStore()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleFocus)
  }
}
