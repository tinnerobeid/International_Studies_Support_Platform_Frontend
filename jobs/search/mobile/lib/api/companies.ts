import { api } from './client'
import type { Company, PaginatedResponse } from '@/types'

export const companiesApi = {
  mine: () =>
    api.get<PaginatedResponse<Company>>('/companies/mine/').then((r) => r.data.results),

  create: (data: object) =>
    api.post<Company>('/companies/', data).then((r) => r.data),
}
