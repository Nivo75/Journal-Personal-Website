import Papa from 'papaparse'

export interface Peak {
  name: string
  location: string
  lat: number
  lng: number
  elev: number
  gain: number
  distance: number
  date: string
  quality: number
  // Assigned during animation setup
  skyX: number
  skyY: number
  startY: number
}

// Raw CSV row shape
interface HikeRow {
  AscentDate: string
  PeakPointName: string
  Location: string
  Lat: string
  Long: string
  'Elevation(ft)': string
  'Elevation-Gain(ft)': string
  'Distance(mi)': string
  Quality: string
}

let _cache: Peak[] | null = null

export async function loadPeaks(): Promise<Peak[]> {
  if (_cache) return _cache

  const response = await fetch('/hikes.csv')
  const text     = await response.text()

  const result = Papa.parse<HikeRow>(text, {
    header:        true,
    skipEmptyLines: true,
  })

  _cache = result.data
    .filter(row => row.Lat && row.Long && row['Elevation(ft)'])
    .map(row => ({
      name:     row.PeakPointName?.trim() || 'Unknown Peak',
      location: row.Location?.trim()      || '',
      lat:      parseFloat(row.Lat),
      lng:      parseFloat(row.Long),
      elev:     parseInt(row['Elevation(ft)'])       || 0,
      gain:     parseInt(row['Elevation-Gain(ft)'])  || 0,
      distance: parseFloat(row['Distance(mi)'])      || 0,
      date:     row.AscentDate?.trim()               || '',
      quality:  parseInt(row.Quality)                || 0,
      // skyX/skyY/startY assigned by HeroCanvas
      skyX:   0,
      skyY:   0,
      startY: 1.05,
    }))
    .filter(p => !isNaN(p.lat) && !isNaN(p.lng) && p.elev > 0)

  return _cache
}
