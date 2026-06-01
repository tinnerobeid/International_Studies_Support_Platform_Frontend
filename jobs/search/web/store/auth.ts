'use client'
import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  login: (access: string, refresh: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  login: (access, refresh, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    }
    set({ user })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    set({ user: null })
  },
}))
