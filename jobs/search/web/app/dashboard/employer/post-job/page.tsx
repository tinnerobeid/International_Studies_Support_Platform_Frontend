'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { companiesApi } from '@/lib/api/companies'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PostJobPage() {
  const { t } = useLangStore()
  const router = useRouter()
  const [error, setError] = useState('')

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: jobsApi.categories })
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })
  const { data: companies } = useQuery({ queryKey: ['my-companies'], queryFn: companiesApi.list })

  const [form, setForm] = useState({
    title: '', title_sw: '', description: '', description_sw: '',
    requirements: '', company: '', category: '', region: '',
    employment_type: 'FULL_TIME', experience_level: 'NO_EXPERIENCE',
    education_level: 'NONE', salary_display: '', cv_required: false,
    application_method: 'IN_APP', whatsapp_number: '', contact_email: '',
    contact_address: '', positions_available: 1, status: 'ACTIVE', deadline: '',
  })

  const mutation = useMutation({
    mutationFn: (data: any) => jobsApi.create(data),
    onSuccess: () => router.push('/dashboard/employer'),
    onError: (err: any) => setError(JSON.stringify(err.response?.data || 'Failed')),
  })

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = { ...form }
    if (!payload.company) { setError(t('Please select a company', 'Tafadhali chagua kampuni')); return }
    if (!payload.category) delete payload.category
    if (!payload.region) delete payload.region
    if (!payload.deadline) delete payload.deadline
    mutation.mutate(payload)
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition-colors"
  const selectCls = inputCls + " bg-white"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Post a Job', 'Tuma Kazi')}</h1>
      <p className="text-gray-500 text-sm mb-8">{t('Fill in the details to post your job listing', 'Jaza maelezo kutuma tangazo la kazi')}</p>

      {(!companies || companies.length === 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          {t('You need a company profile first.', 'Unahitaji wasifu wa kampuni kwanza.')}{' '}
          <a href="/dashboard/employer/company/new" className="underline">{t('Create company', 'Unda kampuni')}</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('Basic Information', 'Taarifa za Msingi')}</h2>

          <Field label={t('Company', 'Kampuni') + ' *'}>
            <select value={form.company} onChange={(e) => set('company', e.target.value)} className={selectCls} required>
              <option value="">{t('Select company', 'Chagua kampuni')}</option>
              {companies?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Job Title (English)', 'Jina la Kazi (Kiingereza)') + ' *'}>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. Software Developer" required />
            </Field>
            <Field label={t('Job Title (Swahili)', 'Jina la Kazi (Kiswahili)')}>
              <input value={form.title_sw} onChange={(e) => set('title_sw', e.target.value)} className={inputCls} placeholder="mfano: Msanidi Programu" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Category', 'Aina ya Kazi')}>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
                <option value="">{t('Select category', 'Chagua aina')}</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </Field>
            <Field label={t('Region', 'Mkoa')}>
              <select value={form.region} onChange={(e) => set('region', e.target.value)} className={selectCls}>
                <option value="">{t('Select region', 'Chagua mkoa')}</option>
                {regions?.map((r) => <option key={r.id} value={r.id}>{r.name_en}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('Job Details', 'Maelezo ya Kazi')}</h2>

          <Field label={t('Description (English)', 'Maelezo (Kiingereza)') + ' *'}>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} className={inputCls + ' resize-none'} placeholder={t('Describe the role...', 'Eleza kazi...')} required />
          </Field>
          <Field label={t('Description (Swahili)', 'Maelezo (Kiswahili)')}>
            <textarea value={form.description_sw} onChange={(e) => set('description_sw', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder="Eleza kazi kwa Kiswahili..." />
          </Field>
          <Field label={t('Requirements', 'Mahitaji')}>
            <textarea value={form.requirements} onChange={(e) => set('requirements', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder={t('List qualifications, skills needed...', 'Orodhesha sifa, ujuzi unaohitajika...')} />
          </Field>
        </div>

        {/* Job type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('Job Type & Salary', 'Aina ya Kazi na Mshahara')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label={t('Employment Type', 'Aina ya Ajira')}>
              <select value={form.employment_type} onChange={(e) => set('employment_type', e.target.value)} className={selectCls}>
                {[['FULL_TIME','Full Time'],['PART_TIME','Part Time'],['CONTRACT','Contract'],['CASUAL','Casual'],['INTERNSHIP','Internship'],['VOLUNTEER','Volunteer']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label={t('Experience Level', 'Kiwango cha Uzoefu')}>
              <select value={form.experience_level} onChange={(e) => set('experience_level', e.target.value)} className={selectCls}>
                {[['NO_EXPERIENCE','No Experience'],['JUNIOR','Junior'],['MID','Mid-Level'],['SENIOR','Senior'],['EXECUTIVE','Executive']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label={t('Positions Available', 'Nafasi Zilizopo')}>
              <input type="number" min={1} value={form.positions_available} onChange={(e) => set('positions_available', Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Salary (display text)', 'Mshahara (maandishi)')}>
              <input value={form.salary_display} onChange={(e) => set('salary_display', e.target.value)} className={inputCls} placeholder="e.g. TZS 500,000/month or Negotiable" />
            </Field>
            <Field label={t('Application Deadline', 'Mwisho wa Kuomba')}>
              <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Application method */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('How to Apply', 'Jinsi ya Kuomba')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Application Method', 'Njia ya Kuomba')}>
              <select value={form.application_method} onChange={(e) => set('application_method', e.target.value)} className={selectCls}>
                {[['IN_APP','Via Search App'],['WHATSAPP','Via WhatsApp'],['EMAIL','Via Email'],['WALK_IN','Walk-In']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            {form.application_method === 'WHATSAPP' && (
              <Field label={t('WhatsApp Number', 'Namba ya WhatsApp')}>
                <input value={form.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} className={inputCls} placeholder="+255712345678" />
              </Field>
            )}
            {form.application_method === 'EMAIL' && (
              <Field label={t('Contact Email', 'Barua Pepe ya Mawasiliano')}>
                <input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} className={inputCls} />
              </Field>
            )}
            {form.application_method === 'WALK_IN' && (
              <Field label={t('Address', 'Anwani')}>
                <input value={form.contact_address} onChange={(e) => set('contact_address', e.target.value)} className={inputCls} placeholder="Office location..." />
              </Field>
            )}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.cv_required} onChange={(e) => set('cv_required', e.target.checked)} className="w-4 h-4 accent-emerald-600" />
            <span className="text-sm font-medium text-gray-700">{t('Require CV from applicants', 'Hitaji CV kutoka kwa waombaji')}</span>
          </label>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        <button type="submit" disabled={mutation.isPending} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
          {mutation.isPending ? t('Publishing...', 'Inachapisha...') : t('Publish Job', 'Chapisha Kazi')}
        </button>
      </form>
    </div>
  )
}
