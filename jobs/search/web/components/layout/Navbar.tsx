'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { authApi } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { BriefcaseIcon, MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { lang, setLang, t } = useLangStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token') || ''
    await authApi.logout(refresh).catch(() => {})
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <BriefcaseIcon className="w-6 h-6" />
          Search
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/jobs" className="text-gray-600 hover:text-emerald-600 transition-colors">
            {t('Browse Jobs', 'Tafuta Kazi')}
          </Link>
          {user?.role === 'EMPLOYER' && (
            <Link href="/dashboard/employer" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('Dashboard', 'Dashibodi')}
            </Link>
          )}
          {user?.role === 'JOB_SEEKER' && (
            <Link href="/dashboard/seeker" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('My Applications', 'Maombi Yangu')}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors font-medium"
          >
            {lang === 'en' ? 'SW' : 'EN'}
          </button>

          {user ? (
            <>
              {user.role === 'EMPLOYER' && (
                <Link
                  href="/dashboard/employer/post-job"
                  className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {t('Post a Job', 'Tuma Kazi')}
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44 hidden group-hover:block">
                  <p className="px-3 py-2 text-xs text-gray-400 border-b">{user.full_name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t('Logout', 'Ondoka')}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-emerald-600">
                {t('Login', 'Ingia')}
              </Link>
              <Link
                href="/auth/register"
                className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {t('Register', 'Jisajili')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/jobs" onClick={() => setOpen(false)} className="text-gray-700">
            {t('Browse Jobs', 'Tafuta Kazi')}
          </Link>
          {user?.role === 'EMPLOYER' && (
            <>
              <Link href="/dashboard/employer" onClick={() => setOpen(false)} className="text-gray-700">
                {t('Dashboard', 'Dashibodi')}
              </Link>
              <Link href="/dashboard/employer/post-job" onClick={() => setOpen(false)} className="text-emerald-600 font-medium">
                {t('Post a Job', 'Tuma Kazi')}
              </Link>
            </>
          )}
          {user?.role === 'JOB_SEEKER' && (
            <Link href="/dashboard/seeker" onClick={() => setOpen(false)} className="text-gray-700">
              {t('My Applications', 'Maombi Yangu')}
            </Link>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="text-xs border border-gray-300 rounded px-2 py-1">
              {lang === 'en' ? 'Swahili' : 'English'}
            </button>
            {!user && (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)} className="text-gray-600">
                  {t('Login', 'Ingia')}
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)} className="text-emerald-600 font-medium">
                  {t('Register', 'Jisajili')}
                </Link>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="text-red-500">
                {t('Logout', 'Ondoka')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
