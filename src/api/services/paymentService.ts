import api from '../axios'
import { API_ENDPOINTS } from '../endpoints'
import type { StartPaymentRequest } from '../../types/portalDtos'

export const paymentService = {
  // Start a payment checkout flow (POST /api/payments/start)
  startPayment: async (data: StartPaymentRequest): Promise<Record<string, string>> => {
    const response = await api.post<Record<string, string>>(API_ENDPOINTS.PAYMENTS.START, data)
    return response.data ?? {}
  },
}
