import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Lang } from '@/types'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => Promise<void>
  t: (en: string, sw: string) => string
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'sw',

  setLang: async (lang) => {
    await AsyncStorage.setItem('lang', lang)
    set({ lang })
  },

  t: (en, sw) => (get().lang === 'en' ? en : sw),
}))
