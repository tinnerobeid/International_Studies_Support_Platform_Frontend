'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, FileIcon, PhoneIcon } from 'lucide-react'
import dayjs from 'dayjs'

const STATUS_OPTIONS = ['SUBMITTED','VIEWED','SHORTLISTED','REJECTED','HIRED']
const STATUS_COLORS: Record<string,string> = {
  SUBMITTED: 'bg-gray-100 text-gray-600',
  VIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-600',
  HIRED: 'bg-purple-100 text-purple-700',
}

export default function JobApplicantsPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['applicants', slug],
    queryFn: () => applicationsApi.forJob(slug),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', slug] }),
  })

  const apps = data?.results || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeftIcon className="w-4 h-4" /> {t('Back to Dashboard', 'Rudi Dashibodini')}
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('Applicants', 'Waombaji')}</h1>
        <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
          {apps.length} {t('total', 'jumla')}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">{t('Loading...', 'Inapakia...')}</div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>{t('No applications yet', 'Hakuna maombi bado')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {app.applicant_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{app.applicant_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <PhoneIcon className="w-3 h-3" />{app.applicant_phone}
                      </p>
                    </div>
                  </div>

                  {app.cover_letter && (
                    <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3 max-w-xl">
                      "{app.cover_letter.slice(0, 200)}{app.cover_letter.length > 200 ? '...' : ''}"
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{t('Applied', 'Aliomba')} {dayjs(app.applied_at).fromNow()}</span>
                    {app.cv_file && (
                      <a href={app.cv_file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:underline">
                        <FileIcon className="w-3 h-3" /> {t('Download CV', 'Pakua CV')}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                  <select
                    value={app.status}
                    onChange={(e) => statusMutation.mutate({ id: app.id, status: e.target.value })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-400 bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
