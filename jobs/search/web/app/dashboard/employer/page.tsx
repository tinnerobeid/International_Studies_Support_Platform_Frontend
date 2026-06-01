'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon, EyeIcon, UsersIcon, BriefcaseIcon } from 'lucide-react'
import { useEffect } from 'react'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  CLOSED: 'bg-red-100 text-red-600',
  EXPIRED: 'bg-amber-100 text-amber-700',
}

export default function EmployerDashboard() {
  const { t } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()

  useEffect(() => {
    if (user && user.role !== 'EMPLOYER') router.push('/')
  }, [user, router])

  const { data, isLoading } = useQuery({ queryKey: ['my-jobs'], queryFn: jobsApi.mine })

  const closeMutation = useMutation({
    mutationFn: (slug: string) => jobsApi.update(slug, { status: 'CLOSED' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-jobs'] }),
  })

  const jobs = data?.results || []
  const activeCount = jobs.filter((j) => j.status === 'ACTIVE').length
  const totalApplications = jobs.reduce((s, j) => s + (j.applications_count || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Employer Dashboard', 'Dashibodi ya Mwajiri')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('Manage your job postings', 'Simamia matangazo yako ya kazi')}</p>
        </div>
        <Link href="/dashboard/employer/post-job" className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
          <PlusIcon className="w-4 h-4" /> {t('Post a Job', 'Tuma Kazi')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: t('Active Jobs', 'Kazi Zinazoendelea'), value: activeCount, icon: BriefcaseIcon, color: 'text-emerald-600' },
          { label: t('Total Jobs', 'Jumla ya Kazi'), value: jobs.length, icon: BriefcaseIcon, color: 'text-blue-600' },
          { label: t('Applications', 'Maombi'), value: totalApplications, icon: UsersIcon, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Job list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t('Your Job Postings', 'Matangazo Yako ya Kazi')}</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">{t('Loading...', 'Inapakia...')}</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('No jobs posted yet', 'Hakuna kazi zilizotumwa bado')}</p>
            <Link href="/dashboard/employer/post-job" className="mt-3 inline-block text-emerald-600 hover:underline text-sm font-medium">
              {t('Post your first job', 'Tuma kazi yako ya kwanza')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{dayjs(job.created_at).format('MMM D, YYYY')}</span>
                    <span>{job.applications_count} {t('applications', 'maombi')}</span>
                    <span>{job.views_count} {t('views', 'maoni')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[job.status]}`}>
                    {job.status}
                  </span>
                  <Link href={`/dashboard/employer/jobs/${job.slug}`} className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <UsersIcon className="w-3 h-3" /> {t('Applicants', 'Waombaji')}
                  </Link>
                  <Link href={`/jobs/${job.slug}`} className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <EyeIcon className="w-3 h-3" /> {t('View', 'Ona')}
                  </Link>
                  {job.status === 'ACTIVE' && (
                    <button onClick={() => closeMutation.mutate(job.slug)} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      {t('Close', 'Funga')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
