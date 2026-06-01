import { api } from './client'
import type { Job, JobCategory, PaginatedResponse } from '@/types'

export interface JobFilters {
  q?: string
  region?: number
  category?: string
  employment_type?: string
  experience_level?: string
  cv_required?: boolean
  page?: number
}

export const jobsApi = {
  list: (filters: JobFilters = {}) =>
    api.get<PaginatedResponse<Job>>('/jobs/', { params: filters }).then((r) => r.data),

  detail: (slug: string) =>
    api.get<Job>(`/jobs/${slug}/`).then((r) => r.data),

  featured: () =>
    api.get<PaginatedResponse<Job>>('/jobs/featured/').then((r) => r.data.results),

  categories: () =>
    api.get<PaginatedResponse<JobCategory>>('/jobs/categories/').then((r) => r.data.results),

  mine: () =>
    api.get<PaginatedResponse<Job>>('/jobs/mine/').then((r) => r.data),

  create: (data: object) =>
    api.post<Job>('/jobs/', data).then((r) => r.data),

  update: (slug: string, data: object) =>
    api.patch<Job>(`/jobs/${slug}/`, data).then((r) => r.data),
}
