'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/companies'
import { locationsApi } from '@/lib/api/locations'
import { jobsApi } from '@/lib/api/jobs'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { BuildingIcon, UploadIcon } from 'lucide-react'

const EMPLOYEE_COUNTS = [
  ['1-10', '1-10'],
  ['11-50', '11-50'],
  ['51-200', '51-200'],
  ['201-500', '201-500'],
  ['500+', '500+'],
]

export default function NewCompanyPage() {
  const { t } = useLangStore()
  const router = useRouter()
  const logoRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: jobsApi.categories })

  const [form, setForm] = useState({
    name: '', name_sw: '', description: '', website: '',
    phone_number: '', email: '', address: '',
    region: '', industry: '', employee_count: '1-10',
  })

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const mutation = useMutation({
    mutationFn: (fd: FormData) => companiesApi.create(fd),
    onSuccess: () => router.push('/dashboard/employer/post-job'),
    onError: (err: any) => setError(JSON.stringify(err.response?.data || 'Failed')),
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setLogoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    const logo = logoRef.current?.files?.[0]
    if (logo) fd.append('logo', logo)
    mutation.mutate(fd)
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition-colors"
  const selectCls = inputCls + " bg-white"

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <BuildingIcon className="w-5 h-5 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t('Create Company Profile', 'Unda Wasifu wa Kampuni')}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-13">{t('You need a company profile to post jobs', 'Unahitaji wasifu wa kampuni kutuma kazi')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t('Company Logo', 'Nembo ya Kampuni')}</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {logoPreview
                ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                : <BuildingIcon className="w-8 h-8 text-gray-300" />
              }
            </div>
            <div>
              <button type="button" onClick={() => logoRef.current?.click()} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <UploadIcon className="w-4 h-4" /> {t('Upload Logo', 'Pakia Nembo')}
              </button>
              <p className="text-xs text-gray-400 mt-1">{t('PNG, JPG up to 2MB', 'PNG, JPG hadi 2MB')}</p>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('Company Information', 'Taarifa za Kampuni')}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Company Name (English)', 'Jina la Kampuni (Kiingereza)') + ' *'}>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Acme Ltd" required />
            </Field>
            <Field label={t('Company Name (Swahili)', 'Jina la Kampuni (Kiswahili)')}>
              <input value={form.name_sw} onChange={(e) => set('name_sw', e.target.value)} className={inputCls} placeholder="Acme Ltd" />
            </Field>
          </div>

          <Field label={t('Description', 'Maelezo')}>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder={t('What does your company do?', 'Kampuni yako inafanya nini?')} />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Industry', 'Sekta')}>
              <select value={form.industry} onChange={(e) => set('industry', e.target.value)} className={selectCls}>
                <option value="">{t('Select industry', 'Chagua sekta')}</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </Field>
            <Field label={t('Company Size', 'Ukubwa wa Kampuni')}>
              <select value={form.employee_count} onChange={(e) => set('employee_count', e.target.value)} className={selectCls}>
                {EMPLOYEE_COUNTS.map(([v, l]) => <option key={v} value={v}>{l} {t('employees', 'wafanyakazi')}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('Contact & Location', 'Mawasiliano na Mahali')}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Phone Number', 'Namba ya Simu')}>
              <input value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} className={inputCls} placeholder="+255712345678" />
            </Field>
            <Field label={t('Email', 'Barua Pepe')}>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="info@company.com" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('Region', 'Mkoa')}>
              <select value={form.region} onChange={(e) => set('region', e.target.value)} className={selectCls}>
                <option value="">{t('Select region', 'Chagua mkoa')}</option>
                {regions?.map((r) => <option key={r.id} value={r.id}>{r.name_en}</option>)}
              </select>
            </Field>
            <Field label={t('Website', 'Tovuti')}>
              <input value={form.website} onChange={(e) => set('website', e.target.value)} className={inputCls} placeholder="https://yourcompany.com" />
            </Field>
          </div>

          <Field label={t('Address', 'Anwani')}>
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} placeholder={t('Street, City', 'Mtaa, Mji')} />
          </Field>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        <button type="submit" disabled={mutation.isPending} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
          {mutation.isPending ? t('Creating...', 'Inaunda...') : t('Create Company Profile', 'Unda Wasifu wa Kampuni')}
        </button>
      </form>
    </div>
  )
}
