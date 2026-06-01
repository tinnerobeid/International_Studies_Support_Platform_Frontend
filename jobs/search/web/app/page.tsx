'use client'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import JobCard from '@/components/jobs/JobCard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SearchIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'

const CATEGORY_ICONS: Record<string, string> = {
  kilimo: '🌾', madini: '⛏️', utalii: '🏨', nyumbani: '🏠',
  ujenzi: '🏗️', usafirishaji: '🚛', elimu: '📚', afya: '❤️',
  teknolojia: '💻', fedha: '💰', biashara: '🛍️', ngo: '🤝',
  serikali: '🏛️', ulinzi: '🛡️', viwanda: '🏭', habari: '📻',
  sheria: '⚖️', kawaida: '💼',
}

export default function HomePage() {
  const { lang, t } = useLangStore()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [regionId, setRegionId] = useState('')

  const { data: featured } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: jobsApi.featured,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: jobsApi.categories,
  })

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: locationsApi.regions,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (regionId) params.set('region', regionId)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            {t('Find Your Next Job in Tanzania', 'Pata Kazi Yako Tanzania')}
          </h1>
          <p className="text-emerald-200 text-lg mb-8">
            {t(
              'From casual work to professional roles — all regions, all levels.',
              'Kazi za kawaida hadi za kitaaluma — mikoa yote, ngazi zote.'
            )}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1 px-3">
              <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('Job title, keyword...', 'Jina la kazi, neno...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-gray-800 text-sm py-2"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t md:border-t-0 md:border-l border-gray-200">
              <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="outline-none text-gray-800 text-sm py-2 bg-transparent"
              >
                <option value="">{t('All Regions', 'Mikoa Yote')}</option>
                {regions?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {lang === 'sw' ? r.name_sw : r.name_en}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              {t('Search', 'Tafuta')}
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {t('Browse by Category', 'Tafuta kwa Aina')}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/jobs?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-center"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat.slug] || '💼'}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">
                  {lang === 'sw' ? cat.name_sw : cat.name_en}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured / Recent Jobs */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              {t('Latest Jobs', 'Kazi za Hivi Karibuni')}
            </h2>
            <Link href="/jobs" className="text-sm text-emerald-600 hover:underline font-medium">
              {t('View all →', 'Ona zote →')}
            </Link>
          </div>

          {featured && featured.length > 0 ? (
            <div className="grid gap-3">
              {featured.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t('No jobs posted yet. Be the first!', 'Hakuna kazi bado. Kuwa wa kwanza!')}</p>
              <Link href="/auth/register" className="mt-4 inline-block text-emerald-600 font-medium hover:underline">
                {t('Post a Job', 'Tuma Kazi')}
              </Link>
            </div>
          )}
        </section>

        {/* CTA for employers */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            {t('Hiring? Post a job for free.', 'Unatafuta wafanyakazi? Tuma kazi bure.')}
          </h2>
          <p className="text-emerald-700 mb-6">
            {t(
              'Reach thousands of job seekers across all regions of Tanzania.',
              'Fikia maelfu ya watafutaji kazi katika mikoa yote ya Tanzania.'
            )}
          </p>
          <Link
            href="/auth/register?role=EMPLOYER"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-block"
          >
            {t('Get Started Free', 'Anza Bure')}
          </Link>
        </section>
      </div>
    </div>
  )
}
