import { api } from './client'
import type { Region } from '@/types'

export const locationsApi = {
  regions: () => api.get<Region[]>('/locations/regions/').then((r) => r.data),
  districts: (regionId: number) =>
    api.get(`/locations/regions/${regionId}/districts/`).then((r) => r.data),
}
