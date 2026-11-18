import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { CallInviteResponse } from '../../types/portalDtos'

export const callService = {
  // Create an invite for an extra participant (POST /api/calls/{appointmentId}/invite)
  invite: async (appointmentId: number | string): Promise<CallInviteResponse> => {
    const response = await api.post<CallInviteResponse>(API_ENDPOINTS.CALLS.INVITE(appointmentId))
    return response.data ?? {}
  },

  // Extend the running session (POST /api/calls/{appointmentId}/extend)
  extend: async (appointmentId: number | string): Promise<void> => {
    await api.post(API_ENDPOINTS.CALLS.EXTEND(appointmentId))
  },

  // Join a call through an invite token (POST /api/calls/join/{inviteToken})
  join: async (inviteToken: string, body: Record<string, string> = {}): Promise<CallInviteResponse> => {
    const response = await api.post<CallInviteResponse>(API_ENDPOINTS.CALLS.JOIN(inviteToken), body)
    return response.data ?? {}
  },
}

/**
 * Extracts a shareable invite link from the free-form invite response.
 * Falls back to building a link from a token when only a token is returned.
 */
export function resolveInviteLink(data: CallInviteResponse): { link?: string; token?: string } {
  const values = Object.entries(data ?? {})
  const link = values.find(([k, v]) => /url|link/i.test(k) && typeof v === 'string')?.[1]
    ?? values.find(([, v]) => typeof v === 'string' && /^https?:\/\//.test(v))?.[1]
  const token = data?.inviteToken ?? data?.token ?? values.find(([k]) => /token/i.test(k))?.[1]
  return { link, token }
}
