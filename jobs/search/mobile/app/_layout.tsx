import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { authApi } from '@/lib/api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'

dayjs.extend(relativeTime)

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
})

function AuthLoader({ onReady }: { onReady: () => void }) {
  const { login } = useAuthStore()
  const { setLang } = useLangStore()

  useEffect(() => {
    const init = async () => {
      try {
        const [lang, access, refresh] = await Promise.all([
          AsyncStorage.getItem('lang'),
          AsyncStorage.getItem('access_token'),
          AsyncStorage.getItem('refresh_token'),
        ])

        if (lang === 'en' || lang === 'sw') setLang(lang)

        if (access && refresh) {
          try {
            const user = await authApi.me()
            await login(access, refresh, user)
          } catch {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token'])
          }
        }
      } finally {
        onReady()
      }
    }
    init()
  }, [])

  return null
}

export default function RootLayout() {
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader onReady={hideSplash} />
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
