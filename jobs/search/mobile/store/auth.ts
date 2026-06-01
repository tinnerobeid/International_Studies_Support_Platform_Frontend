import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  login: (access: string, refresh: string, user: User) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (access, refresh, user) => {
    await AsyncStorage.setItem('access_token', access)
    await AsyncStorage.setItem('refresh_token', refresh)
    set({ user })
  },

  logout: async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    set({ user: null })
  },

  setUser: (user) => set({ user }),
}))
