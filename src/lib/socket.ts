import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (socket) return socket

  const token = useAuthStore.getState().token
  const tenantId = useAuthStore.getState().currentTenantId

  socket = io(import.meta.env.VITE_WS_URL || '', {
    autoConnect: false,
    auth: {
      token,
      tenantId,
    },
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
