export interface Region {
  id: number
  name_en: string
  name_sw: string
  slug: string
  is_mainland: boolean
}

export interface JobCategory {
  id: number
  name_en: string
  name_sw: string
  slug: string
  icon: string
}

export interface Company {
  id: string
  name: string
  name_sw: string
  slug: string
  description: string
  logo: string | null
  website: string
  phone_number: string
  email: string
  region: number | null
  region_name: string | null
  address: string
  industry: number | null
  employee_count: string
  is_verified: boolean
  owner_name: string
  active_jobs_count: number
  created_at: string
}

export interface Job {
  id: string
  slug: string
  title: string
  title_sw: string
  description: string
  description_sw: string
  requirements: string
  requirements_sw: string
  company: string
  company_name: string
  company_logo: string | null
  company_slug: string
  company_description: string
  category: number | null
  category_name: { en: string; sw: string } | null
  category_slug: string | null
  region: number | null
  region_name: { en: string; sw: string } | null
  district: number | null
  district_name: { en: string; sw: string } | null
  employment_type: string
  experience_level: string
  education_level: string
  salary_min: string | null
  salary_max: string | null
  salary_display: string
  cv_required: boolean
  application_method: string
  whatsapp_number: string
  contact_email: string
  contact_address: string
  deadline: string | null
  positions_available: number
  status: string
  views_count: number
  is_featured: boolean
  applications_count: number
  created_at: string
  expires_at: string
}

export interface Application {
  id: string
  job: string
  job_title: string
  job_slug: string
  company_name: string
  company_logo: string | null
  applicant: string
  applicant_name: string
  applicant_phone: string
  cover_letter: string
  cv_file: string | null
  cv_url: string
  status: string
  applied_at: string
  updated_at: string
}

export interface User {
  id: string
  phone_number: string
  email: string | null
  full_name: string
  role: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'
  preferred_language: 'en' | 'sw'
  profile_photo: string | null
  region: number | null
  region_name: string | null
  is_verified: boolean
  date_joined: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type Lang = 'en' | 'sw'
