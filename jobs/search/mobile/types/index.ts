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
  slug: string
  description: string
  logo: string | null
  region_name: string | null
  employee_count: string
  active_jobs_count: number
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
  company_name: string
  company_logo: string | null
  company_slug: string
  company_description: string
  region_name: string | null
  region_name_sw: string | null
  district_name: string | null
  district_name_sw: string | null
  category_name: string | null
  category_name_sw: string | null
  category_slug: string | null
  employment_type: string
  experience_level: string
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
  applications_count: number
  is_featured: boolean
  created_at: string
  expires_at: string
}

export interface Application {
  id: string
  job: string
  job_title: string
  job_slug: string
  company_name: string
  applicant_name: string
  applicant_phone: string
  cover_letter: string
  cv_file: string | null
  status: string
  applied_at: string
}

export interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  phone_number: string
  address: string
  email: string | null
  role: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'
  preferred_language: 'en' | 'sw'
  is_verified: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type Lang = 'en' | 'sw'

export interface SeekerProfile {
  username: string
  full_name: string
  phone_number: string
  region: number | null
  region_name: string
  bio: string
  profile_photo: string | null
  date_of_birth: string | null
  gender: 'M' | 'F' | 'O' | ''
  is_discoverable: boolean
  profile_views: number
  updated_at: string
}

export interface WorkExperience {
  id: number
  job_title: string
  company_name: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  created_at: string
}

export interface Education {
  id: number
  institution_name: string
  level: string
  field_of_study: string
  start_year: number
  end_year: number | null
  grade: string
  created_at: string
}

export interface Skill {
  id: number
  name_en: string
  name_sw: string
}

export interface SeekerSkill {
  id: number
  skill: Skill
  level: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
}

export interface SeekerCV {
  id: number
  file: string
  original_filename: string
  uploaded_at: string
  is_primary: boolean
}

export interface DiscoverableSeeker {
  username: string
  full_name: string
  phone_number: string
  region_name: string
  bio: string
  profile_photo: string | null
  gender: string
  skills: { name: string; level: string }[]
  latest_experience: { job_title: string; company_name: string; is_current: boolean } | null
  latest_education: { level: string; institution_name: string } | null
}

export interface JobAlert {
  id: number
  keyword: string
  category: number | null
  category_name: string
  region: number | null
  region_name: string
  employment_type: string
  is_active: boolean
  created_at: string
}
