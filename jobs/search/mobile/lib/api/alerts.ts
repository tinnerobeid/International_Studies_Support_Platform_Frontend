import { api } from './client'
import type { JobAlert } from '@/types'

export const alertsApi = {
  list: () =>
    api.get<JobAlert[]>('/alerts/').then((r) => r.data),

  create: (data: Partial<JobAlert>) =>
    api.post<JobAlert>('/alerts/', data).then((r) => r.data),

  update: (id: number, data: Partial<JobAlert>) =>
    api.patch<JobAlert>(`/alerts/${id}/`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/alerts/${id}/`),
}
