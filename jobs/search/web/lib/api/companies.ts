import { api } from './client'
import type { Company, PaginatedResponse } from '@/types'

export const companiesApi = {
  list: () => api.get<PaginatedResponse<Company>>('/companies/').then((r) => r.data.results),

  detail: (slug: string) =>
    api.get<Company>(`/companies/${slug}/`).then((r) => r.data),

  create: (data: FormData) =>
    api.post<Company>('/companies/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (slug: string, data: FormData) =>
    api.patch<Company>(`/companies/${slug}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
}
