import { api } from './client'
import type { Region } from '@/types'

export const locationsApi = {
  regions: () => api.get<Region[]>('/locations/regions/').then((r) => r.data),
}
