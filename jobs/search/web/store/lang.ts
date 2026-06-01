'use client'
import { create } from 'zustand'
import type { Lang } from '@/types'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (en: string, sw: string) => string
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'en',
  setLang: (lang) => {
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang)
    set({ lang })
  },
  t: (en, sw) => (get().lang === 'sw' ? sw : en),
}))
