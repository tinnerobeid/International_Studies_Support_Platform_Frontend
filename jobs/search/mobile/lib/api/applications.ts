import { api } from './client'
import type { Application, PaginatedResponse } from '@/types'

export const applicationsApi = {
  apply: (data: FormData) =>
    api.post('/applications/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  mine: () =>
    api.get<PaginatedResponse<Application>>('/applications/mine/').then((r) => r.data),

  forJob: (slug: string) =>
    api.get<PaginatedResponse<Application>>(`/applications/job/${slug}/`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/applications/${id}/status/`, { status }).then((r) => r.data),

  withdraw: (id: string) =>
    api.delete(`/applications/${id}/`).then((r) => r.data),

  saveToggle: (jobId: string) =>
    api.post(`/applications/save/${jobId}/`).then((r) => r.data),

  saved: () =>
    api.get<PaginatedResponse<any>>('/applications/saved/').then((r) => r.data),
}
