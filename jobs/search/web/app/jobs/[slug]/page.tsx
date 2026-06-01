'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, CalendarIcon, BriefcaseIcon, BookmarkIcon, MessageCircleIcon, ArrowLeftIcon } from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang, t } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.detail(slug),
  })

  const applyMutation = useMutation({
    mutationFn: (fd: FormData) => applicationsApi.apply(fd),
    onSuccess: () => { setApplied(true); setShowApplyForm(false) },
  })

  const saveMutation = useMutation({
    mutationFn: () => applicationsApi.saveToggle(slug),
    onSuccess: (data) => setSaved(data.saved),
  })

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }
    const fd = new FormData()
    fd.append('job', job!.id)
    if (coverLetter) fd.append('cover_letter', coverLetter)
    if (cvFile) fd.append('cv_file', cvFile)
    applyMutation.mutate(fd)
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Habari, ninaomba kazi ya ${job?.title} - ${window.location.href}`)
    window.open(`https://wa.me/${job?.whatsapp_number?.replace(/\D/g, '')}?text=${msg}`, '_blank')
  }

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  )

  if (!job) return <div className="text-center py-20 text-gray-400">{t('Job not found', 'Kazi haijapatikana')}</div>

  const title = lang === 'sw' && job.title_sw ? job.title_sw : job.title
  const description = lang === 'sw' && job.description_sw ? job.description_sw : job.description
  const requirements = lang === 'sw' && job.requirements_sw ? job.requirements_sw : job.requirements
  const regionName = job.region_name ? (lang === 'sw' ? job.region_name.sw : job.region_name.en) : null
  const categoryName = job.category_name ? (lang === 'sw' ? job.category_name.sw : job.category_name.en) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeftIcon className="w-4 h-4" /> {t('Back', 'Rudi')}
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.company_logo ? (
                  <Image src={job.company_logo} alt={job.company_name} width={64} height={64} className="object-cover" />
                ) : (
                  <BriefcaseIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <Link href={`/companies/${job.company_slug}`} className="text-emerald-600 hover:underline font-medium">
                  {job.company_name}
                </Link>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                  {regionName && <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{regionName}</span>}
                  {categoryName && <span className="flex items-center gap-1"><BriefcaseIcon className="w-4 h-4" />{categoryName}</span>}
                  {job.deadline && <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" />{t('Deadline', 'Mwisho')}: {dayjs(job.deadline).format('MMM D, YYYY')}</span>}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">{job.employment_type.replace('_', ' ')}</span>
              {job.cv_required && <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">{t('CV Required', 'CV Inahitajika')}</span>}
              {job.salary_display && <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">{job.salary_display}</span>}
              {job.positions_available > 1 && <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">{job.positions_available} {t('positions', 'nafasi')}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('Job Description', 'Maelezo ya Kazi')}</h2>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{description}</div>
          </div>

          {/* Requirements */}
          {requirements && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('Requirements', 'Mahitaji')}</h2>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{requirements}</div>
            </div>
          )}

          {/* Apply form */}
          {showApplyForm && (
            <div className="bg-white rounded-xl border border-emerald-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Apply for this Job', 'Omba Kazi Hii')}</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Cover Letter (optional)', 'Barua ya Maombi (si lazima)')}</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    placeholder={t('Tell the employer why you are a good fit...', 'Mwambie mwajiri kwa nini unafaa...')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none"
                  />
                </div>
                {job.cv_required && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Upload CV (PDF or Word)', 'Pakia CV (PDF au Word)')}<span className="text-red-500 ml-1">*</span></label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="submit" disabled={applyMutation.isPending} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                    {applyMutation.isPending ? t('Submitting...', 'Inatumwa...') : t('Submit Application', 'Tuma Ombi')}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    {t('Cancel', 'Ghairi')}
                  </button>
                </div>
                {applyMutation.isError && <p className="text-red-500 text-sm">{t('Failed to submit. Please try again.', 'Imeshindwa kutuma. Jaribu tena.')}</p>}
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply CTA */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            {applied ? (
              <div className="text-center py-2">
                <p className="text-emerald-600 font-semibold">✓ {t('Application Submitted!', 'Ombi Limetumwa!')}</p>
                <Link href="/dashboard/seeker" className="text-sm text-gray-500 hover:underline mt-1 block">{t('View my applications', 'Ona maombi yangu')}</Link>
              </div>
            ) : (
              <>
                {job.application_method === 'IN_APP' && (
                  <button
                    onClick={() => { if (!user) router.push('/auth/login'); else setShowApplyForm(true) }}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    {t('Apply Now', 'Omba Sasa')}
                  </button>
                )}
                {job.application_method === 'WHATSAPP' && (
                  <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <MessageCircleIcon className="w-5 h-5" /> {t('Apply via WhatsApp', 'Omba kwa WhatsApp')}
                  </button>
                )}
                {job.application_method === 'EMAIL' && (
                  <a href={`mailto:${job.contact_email}?subject=Application for ${job.title}`} className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center">
                    {t('Apply via Email', 'Omba kwa Barua Pepe')}
                  </a>
                )}
                {job.application_method === 'WALK_IN' && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-600">
                    <p className="font-medium">{t('Walk-in Application', 'Omba Ukifika')}</p>
                    <p className="mt-1">{job.contact_address}</p>
                  </div>
                )}

                {user && (
                  <button onClick={() => saveMutation.mutate()} className="w-full mt-2 border border-gray-200 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                    <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                    {saved ? t('Saved', 'Imehifadhiwa') : t('Save Job', 'Hifadhi Kazi')}
                  </button>
                )}
              </>
            )}

            {/* Job meta */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>{t('Posted', 'Ilitumwa')}</span><span>{dayjs(job.created_at).fromNow()}</span></div>
              <div className="flex justify-between"><span>{t('Views', 'Maoni')}</span><span>{job.views_count}</span></div>
              {job.deadline && <div className="flex justify-between"><span>{t('Deadline', 'Mwisho')}</span><span className="text-red-500">{dayjs(job.deadline).format('MMM D, YYYY')}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
