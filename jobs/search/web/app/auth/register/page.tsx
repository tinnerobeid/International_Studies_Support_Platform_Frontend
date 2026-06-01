'use client'
import { useState } from 'react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BriefcaseIcon } from 'lucide-react'

export default function RegisterPage() {
  const { t } = useLangStore()
  const { login } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [phone, setPhone] = useState('+255')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState(searchParams.get('role') || 'JOB_SEEKER')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await authApi.requestOtp(phone, 'REGISTER')
      setStep('otp')
    } catch (err: any) {
      setError(err.response?.data?.detail || t('Failed to send OTP', 'Imeshindwa kutuma namba'))
    } finally { setLoading(false) }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const data = await authApi.verifyOtp({ phone_number: phone, code: otp, purpose: 'REGISTER', full_name: fullName, role })
      login(data.access, data.refresh, data.user)
      router.push(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/dashboard/seeker')
    } catch (err: any) {
      setError(err.response?.data?.detail || t('Invalid code', 'Namba si sahihi'))
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
            <BriefcaseIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Create Account', 'Fungua Akaunti')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('Join Search — Tanzania\'s job platform', 'Jiunge na Search')}</p>
        </div>

        {step === 'details' ? (
          <form onSubmit={requestOtp} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('I am a...', 'Mimi ni...')}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'JOB_SEEKER', en: 'Job Seeker', sw: 'Mtafutaji Kazi', emoji: '👤' },
                  { value: 'EMPLOYER', en: 'Employer', sw: 'Mwajiri', emoji: '🏢' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`border-2 rounded-xl p-3 text-center transition-all ${role === r.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <div className="text-sm font-medium text-gray-800">{t(r.en, r.sw)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Full Name', 'Jina Kamili')}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('Your full name', 'Jina lako kamili')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Phone Number', 'Namba ya Simu')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {loading ? t('Sending...', 'Inatuma...') : t('Send Verification Code', 'Tuma Namba ya Uthibitisho')}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Enter 6-digit code', 'Weka namba ya tarakimu 6')}</label>
              <p className="text-xs text-gray-400 mb-2">{t('Code sent to', 'Namba imetumwa kwa')} <strong>{phone}</strong></p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 text-center text-2xl tracking-widest font-bold"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {loading ? t('Creating account...', 'Inafungua akaunti...') : t('Create Account', 'Fungua Akaunti')}
            </button>
            <button type="button" onClick={() => { setStep('details'); setOtp(''); setError('') }} className="w-full text-sm text-gray-500 hover:underline">
              {t('Go back', 'Rudi nyuma')}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('Already have an account?', 'Una akaunti tayari?')}{' '}
          <Link href="/auth/login" className="text-emerald-600 font-medium hover:underline">{t('Login', 'Ingia')}</Link>
        </p>
      </div>
    </div>
  )
}
