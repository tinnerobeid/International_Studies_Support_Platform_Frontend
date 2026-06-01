'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { BriefcaseIcon, BookmarkIcon, XIcon } from 'lucide-react'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string,string> = {
  SUBMITTED: 'bg-gray-100 text-gray-600',
  VIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-600',
  HIRED: 'bg-purple-100 text-purple-700',
}

export default function SeekerDashboard() {
  const { t } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()

  useEffect(() => {
    if (user && user.role === 'EMPLOYER') router.push('/dashboard/employer')
  }, [user, router])

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationsApi.mine,
  })

  const { data: saved, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: applicationsApi.saved,
  })

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.withdraw(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-applications'] }),
  })

  const applications = apps?.results || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('My Dashboard', 'Dashibodi Yangu')}</h1>

      {/* My Applications */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('My Applications', 'Maombi Yangu')}</h2>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">{applications.length}</span>
        </div>

        {appsLoading ? (
          <div className="text-gray-400 text-sm">{t('Loading...', 'Inapakia...')}</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            <BriefcaseIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>{t("You haven't applied for any jobs yet", 'Bado hujaomba kazi yoyote')}</p>
            <Link href="/jobs" className="mt-3 inline-block text-emerald-600 hover:underline text-sm">{t('Browse jobs', 'Tafuta kazi')}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/jobs/${app.job_slug}`} className="font-semibold text-gray-900 hover:text-emerald-600 truncate block">
                    {app.job_title}
                  </Link>
                  <p className="text-sm text-gray-500">{app.company_name}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('Applied', 'Uliomba')} {dayjs(app.applied_at).fromNow()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => withdrawMutation.mutate(app.id)}
                    className="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                    title={t('Withdraw', 'Futa Ombi')}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Jobs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookmarkIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('Saved Jobs', 'Kazi Zilizohifadhiwa')}</h2>
        </div>

        {savedLoading ? (
          <div className="text-gray-400 text-sm">{t('Loading...', 'Inapakia...')}</div>
        ) : !saved?.results?.length ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            <BookmarkIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>{t('No saved jobs', 'Hakuna kazi zilizohifadhiwa')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.results.map((s: any) => (
              <Link key={s.id} href={`/jobs/${s.job.slug}`} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-emerald-300 transition-colors block">
                <div>
                  <p className="font-medium text-gray-900">{s.job.title}</p>
                  <p className="text-sm text-gray-500">{s.job.company_name} · {s.job.region_name}</p>
                </div>
                <span className="text-xs text-gray-400">{dayjs(s.saved_at).fromNow()}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
