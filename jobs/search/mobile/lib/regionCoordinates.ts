export interface RegionCoords {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

const REGION_COORDS: Record<string, RegionCoords> = {
  // Mainland Tanzania
  'arusha':        { latitude: -3.3869,  longitude: 36.6830, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'dar-es-salaam': { latitude: -6.7924,  longitude: 39.2083, latitudeDelta: 0.4, longitudeDelta: 0.4 },
  'dodoma':        { latitude: -6.1722,  longitude: 35.7395, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'geita':         { latitude: -2.8644,  longitude: 32.2278, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'iringa':        { latitude: -7.7700,  longitude: 35.6940, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'kagera':        { latitude: -1.2989,  longitude: 31.8015, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'katavi':        { latitude: -6.8379,  longitude: 31.1312, latitudeDelta: 1.5, longitudeDelta: 1.5 },
  'kigoma':        { latitude: -4.8769,  longitude: 29.6267, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'kilimanjaro':   { latitude: -3.3431,  longitude: 37.3440, latitudeDelta: 0.8, longitudeDelta: 0.8 },
  'lindi':         { latitude: -9.9993,  longitude: 39.7153, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'manyara':       { latitude: -4.3160,  longitude: 36.3525, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'mara':          { latitude: -1.7716,  longitude: 34.0753, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'mbeya':         { latitude: -8.9000,  longitude: 33.4500, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'morogoro':      { latitude: -6.8196,  longitude: 37.6569, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'mtwara':        { latitude: -10.2740, longitude: 40.1877, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'mwanza':        { latitude: -2.5164,  longitude: 32.9175, latitudeDelta: 0.6, longitudeDelta: 0.6 },
  'njombe':        { latitude: -9.3320,  longitude: 34.7769, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'pwani':         { latitude: -7.2880,  longitude: 38.4931, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'rukwa':         { latitude: -7.8740,  longitude: 31.3705, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'ruvuma':        { latitude: -10.6887, longitude: 36.2268, latitudeDelta: 1.5, longitudeDelta: 1.5 },
  'shinyanga':     { latitude: -3.6627,  longitude: 33.4227, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'simiyu':        { latitude: -2.8403,  longitude: 34.0000, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'singida':       { latitude: -4.8175,  longitude: 34.7400, latitudeDelta: 1.2, longitudeDelta: 1.2 },
  'songwe':        { latitude: -8.9618,  longitude: 32.2300, latitudeDelta: 1.0, longitudeDelta: 1.0 },
  'tabora':        { latitude: -5.0168,  longitude: 32.8022, latitudeDelta: 1.5, longitudeDelta: 1.5 },
  'tanga':         { latitude: -5.0693,  longitude: 38.9750, latitudeDelta: 0.8, longitudeDelta: 0.8 },
  // Zanzibar
  'kaskazini-pemba':  { latitude: -5.0630, longitude: 39.7735, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  'kaskazini-unguja': { latitude: -6.1640, longitude: 39.1990, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  'kusini-pemba':     { latitude: -5.3220, longitude: 39.7180, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  'kusini-unguja':    { latitude: -6.3510, longitude: 39.5030, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  'mjini-magharibi':  { latitude: -6.1659, longitude: 39.2026, latitudeDelta: 0.2, longitudeDelta: 0.2 },
}

const DEFAULT_TZ: RegionCoords = { latitude: -6.3728, longitude: 34.8925, latitudeDelta: 8, longitudeDelta: 8 }

export function getRegionCoords(regionNameEn: string | null | undefined): RegionCoords {
  if (!regionNameEn) return DEFAULT_TZ
  const key = regionNameEn
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z-]/g, '')
  return REGION_COORDS[key] || DEFAULT_TZ
}
