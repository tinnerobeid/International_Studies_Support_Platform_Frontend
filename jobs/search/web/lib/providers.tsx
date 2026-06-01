'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { authApi } from '@/lib/api/auth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const { login } = useAuthStore()
  const { setLang } = useLangStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Restore language preference
    const savedLang = localStorage.getItem('lang') as 'en' | 'sw' | null
    if (savedLang) setLang(savedLang)

    // Restore auth session
    const token = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    if (token && refresh) {
      authApi.me().then((user) => login(token, refresh, user)).catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
    }
  }, [login, setLang])

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
