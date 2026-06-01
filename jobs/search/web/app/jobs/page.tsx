'use client'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import JobCard from '@/components/jobs/JobCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react'

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', en: 'Full Time', sw: 'Wakati Wote' },
  { value: 'PART_TIME', en: 'Part Time', sw: 'Sehemu ya Wakati' },
  { value: 'CONTRACT', en: 'Contract', sw: 'Mkataba' },
  { value: 'CASUAL', en: 'Casual', sw: 'Kawaida' },
  { value: 'INTERNSHIP', en: 'Internship', sw: 'Mafunzo' },
  { value: 'VOLUNTEER', en: 'Volunteer', sw: 'Kujitolea' },
]

const EXPERIENCE_LEVELS = [
  { value: 'NO_EXPERIENCE', en: 'No Experience', sw: 'Bila Uzoefu' },
  { value: 'JUNIOR', en: 'Junior', sw: 'Mdogo' },
  { value: 'MID', en: 'Mid-Level', sw: 'Kati' },
  { value: 'SENIOR', en: 'Senior', sw: 'Mkuu' },
  { value: 'EXECUTIVE', en: 'Executive', sw: 'Mtendaji' },
]

export default function JobsPage() {
  const { lang, t } = useLangStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [region, setRegion] = useState(searchParams.get('region') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [employmentType, setEmploymentType] = useState(searchParams.get('employment_type') || '')
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experience_level') || '')
  const [cvRequired, setCvRequired] = useState(searchParams.get('cv_required') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const filters = {
    q: q || undefined,
    region: region ? Number(region) : undefined,
    category: category || undefined,
    employment_type: employmentType || undefined,
    experience_level: experienceLevel || undefined,
    cv_required: cvRequired === 'true' ? true : cvRequired === 'false' ? false : undefined,
    page,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.list(filters),
  })

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: jobsApi.categories })
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })

  const applyFilters = () => {
    setPage(1)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (region) params.set('region', region)
    if (category) params.set('category', category)
    if (employmentType) params.set('employment_type', employmentType)
    if (experienceLevel) params.set('experience_level', experienceLevel)
    if (cvRequired) params.set('cv_required', cvRequired)
    router.push(`/jobs?${params.toString()}`)
  }

  const clearFilters = () => {
    setQ(''); setRegion(''); setCategory(''); setEmploymentType(''); setExperienceLevel(''); setCvRequired('')
    router.push('/jobs')
  }

  const hasFilters = q || region || category || employmentType || experienceLevel || cvRequired

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{t('Filters', 'Vichujio')}</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
                  {t('Clear all', 'Futa yote')}
                </button>
              )}
            </div>

            <FilterPanel
              lang={lang} regions={regions || []} categories={categories || []}
              region={region} setRegion={setRegion}
              category={category} setCategory={setCategory}
              employmentType={employmentType} setEmploymentType={setEmploymentType}
              experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}
              cvRequired={cvRequired} setCvRequired={setCvRequired}
              onApply={applyFilters}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search jobs...', 'Tafuta kazi...')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="flex-1 outline-none text-sm text-gray-800"
              />
              {q && <button onClick={() => { setQ(''); applyFilters() }}><XIcon className="w-4 h-4 text-gray-400" /></button>}
            </div>
            <button
              onClick={applyFilters}
              className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              {t('Search', 'Tafuta')}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 border border-gray-200 bg-white px-3 py-2 rounded-xl text-sm"
            >
              <FilterIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <FilterPanel
                lang={lang} regions={regions || []} categories={categories || []}
                region={region} setRegion={setRegion}
                category={category} setCategory={setCategory}
                employmentType={employmentType} setEmploymentType={setEmploymentType}
                experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}
                cvRequired={cvRequired} setCvRequired={setCvRequired}
                onApply={() => { applyFilters(); setShowFilters(false) }}
              />
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              {isLoading ? t('Loading...', 'Inapakia...') : `${data?.count || 0} ${t('jobs found', 'kazi zimepatikana')}`}
            </p>
          </div>

          {/* Job list */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">{t('No jobs found', 'Hakuna kazi zilizopatikana')}</p>
              <p className="text-sm mt-1">{t('Try adjusting your filters', 'Jaribu kubadilisha vichujio')}</p>
              <button onClick={clearFilters} className="mt-4 text-emerald-600 hover:underline text-sm">
                {t('Clear filters', 'Futa vichujio')}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {data?.results.map((job) => <JobCard key={job.id} job={job} />)}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8">
                {data?.previous && (
                  <button onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    {t('← Previous', '← Iliyotangulia')}
                  </button>
                )}
                {data?.next && (
                  <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                    {t('Next →', 'Inayofuata →')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ lang, regions, categories, region, setRegion, category, setCategory,
  employmentType, setEmploymentType, experienceLevel, setExperienceLevel,
  cvRequired, setCvRequired, onApply }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'sw' ? 'Mkoa' : 'Region'}</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400">
          <option value="">{lang === 'sw' ? 'Mikoa Yote' : 'All Regions'}</option>
          {regions.map((r: any) => <option key={r.id} value={r.id}>{lang === 'sw' ? r.name_sw : r.name_en}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'sw' ? 'Aina ya Kazi' : 'Category'}</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400">
          <option value="">{lang === 'sw' ? 'Aina Zote' : 'All Categories'}</option>
          {categories.map((c: any) => <option key={c.id} value={c.slug}>{lang === 'sw' ? c.name_sw : c.name_en}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'sw' ? 'Muda wa Kazi' : 'Job Type'}</label>
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400">
          <option value="">{lang === 'sw' ? 'Aina Zote' : 'All Types'}</option>
          {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{lang === 'sw' ? t.sw : t.en}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'sw' ? 'Uzoefu' : 'Experience'}</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400">
          <option value="">{lang === 'sw' ? 'Yote' : 'Any Level'}</option>
          {EXPERIENCE_LEVELS.map((e) => <option key={e.value} value={e.value}>{lang === 'sw' ? e.sw : e.en}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">CV</label>
        <select value={cvRequired} onChange={(e) => setCvRequired(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400">
          <option value="">{lang === 'sw' ? 'Yote' : 'All'}</option>
          <option value="false">{lang === 'sw' ? 'CV Sihitajiki' : 'No CV Required'}</option>
          <option value="true">{lang === 'sw' ? 'CV Inahitajika' : 'CV Required'}</option>
        </select>
      </div>

      <button onClick={onApply} className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
        {lang === 'sw' ? 'Chuja' : 'Apply Filters'}
      </button>
    </div>
  )
}
