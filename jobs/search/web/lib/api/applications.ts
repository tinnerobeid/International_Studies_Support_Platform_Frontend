import { api } from './client'
import type { Application, PaginatedResponse } from '@/types'

export const applicationsApi = {
  apply: (data: FormData) =>
    api.post('/applications/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  mine: () =>
    api.get<PaginatedResponse<Application>>('/applications/mine/').then((r) => r.data),

  forJob: (jobSlug: string) =>
    api.get<PaginatedResponse<Application>>(`/applications/job/${jobSlug}/`).then((r) => r.data),

  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/applications/${id}/status/`, { status, employer_notes: notes }).then((r) => r.data),

  withdraw: (id: string) =>
    api.delete(`/applications/${id}/`),

  saveToggle: (jobSlug: string) =>
    api.post(`/applications/save/${jobSlug}/`).then((r) => r.data),

  saved: () =>
    api.get('/applications/saved/').then((r) => r.data),
}
