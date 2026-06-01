import { api } from './client'
import type {
  SeekerProfile, WorkExperience, Education, Skill,
  SeekerSkill, SeekerCV, DiscoverableSeeker, PaginatedResponse,
} from '@/types'

export const profileApi = {
  get: () =>
    api.get<SeekerProfile>('/profile/').then((r) => r.data),

  update: (data: Partial<SeekerProfile>) =>
    api.patch<SeekerProfile>('/profile/', data).then((r) => r.data),

  experience: {
    list: () =>
      api.get<WorkExperience[]>('/profile/experience/').then((r) => r.data),
    create: (data: Omit<WorkExperience, 'id' | 'created_at'>) =>
      api.post<WorkExperience>('/profile/experience/', data).then((r) => r.data),
    update: (id: number, data: Partial<WorkExperience>) =>
      api.patch<WorkExperience>(`/profile/experience/${id}/`, data).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/profile/experience/${id}/`),
  },

  education: {
    list: () =>
      api.get<Education[]>('/profile/education/').then((r) => r.data),
    create: (data: Omit<Education, 'id' | 'created_at'>) =>
      api.post<Education>('/profile/education/', data).then((r) => r.data),
    update: (id: number, data: Partial<Education>) =>
      api.patch<Education>(`/profile/education/${id}/`, data).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/profile/education/${id}/`),
  },

  skills: {
    catalog: () =>
      api.get<Skill[]>('/profile/skills/').then((r) => r.data),
    mine: () =>
      api.get<SeekerSkill[]>('/profile/my-skills/').then((r) => r.data),
    add: (skill_id: number, level: string) =>
      api.post<SeekerSkill>('/profile/my-skills/', { skill_id, level }).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/profile/my-skills/${id}/`),
  },

  cvs: {
    list: () =>
      api.get<SeekerCV[]>('/profile/cvs/').then((r) => r.data),
    upload: (formData: FormData) =>
      api.post<SeekerCV>('/profile/cvs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/profile/cvs/${id}/`),
  },

  seekers: (params?: { region?: number; search?: string }) =>
    api.get<PaginatedResponse<DiscoverableSeeker>>('/profile/seekers/', { params }).then((r) => r.data),
}
