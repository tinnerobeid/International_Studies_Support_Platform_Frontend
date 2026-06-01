import { api } from './client'
import type { User } from '@/types'

export const authApi = {
  requestOtp: (phone_number: string, purpose: 'LOGIN' | 'REGISTER') =>
    api.post('/auth/request-otp/', { phone_number, purpose }).then((r) => r.data),

  verifyOtp: (data: {
    phone_number: string
    code: string
    purpose: 'LOGIN' | 'REGISTER'
    full_name?: string
    role?: string
  }) => api.post<{ access: string; refresh: string; user: User }>('/auth/verify-otp/', data).then((r) => r.data),

  me: () => api.get<User>('/auth/me/').then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/me/', data).then((r) => r.data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
}
