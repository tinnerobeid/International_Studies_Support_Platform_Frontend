import { api } from './client'
import type { User } from '@/types'

export const authApi = {
  register: (payload: {
    username: string
    password: string
    first_name: string
    last_name: string
    phone_number: string
    address?: string
    role: string
  }) => api.post<{ access: string; refresh: string; user: User }>(
    '/auth/register/', payload
  ).then((r) => r.data),

  login: (username: string, password: string) =>
    api.post<{ access: string; refresh: string; user: User }>(
      '/auth/login/', { username, password }
    ).then((r) => r.data),

  resetPassword: (username: string, phone_number: string, new_password: string) =>
    api.post('/auth/reset-password/', { username, phone_number, new_password }).then((r) => r.data),

  googleAuth: (id_token: string) =>
    api.post<{ access: string; refresh: string; user: User; is_new: boolean }>(
      '/auth/google/', { id_token }
    ).then((r) => r.data),

  appleAuth: (identity_token: string, first_name?: string, last_name?: string) =>
    api.post<{ access: string; refresh: string; user: User; is_new: boolean }>(
      '/auth/apple/', { identity_token, first_name, last_name, bundle_id: 'com.searchtz.app' }
    ).then((r) => r.data),

  me: () => api.get<User>('/auth/me/').then((r) => r.data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }).then((r) => r.data),
}
