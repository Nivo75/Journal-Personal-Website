import { useEffect, useState } from 'react'

type HikeRow = {
  AscentDate: string
  PeakPointName: string
  Location: string
  Lat: string
  Long: string
  'Elevation(ft)': string
  'Elevation-Gain(ft)': string
  'Prominence(ft)': string
  'Distance(mi)': string
  'Time-Up(min)': string
  'Time-Down(min)': string
  Quality: string
  'Solo-Hike': string
  [key: string]: string
}

type ComputedStats = {
  uniqueAscents: number
  totalElevationGain: string
  totalDistance: string
  totalTimeOnMountain: string
  statesVisited: number
  soloHikes: number
  highestPeak: string
  avgQuality: string
}

function parseCSV(text: string): HikeRow[] {
  const lines = text.split('\n').filter(l => l.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = vals[i] ?? '' })
    return row as HikeRow
  })
}

function computeStats(rows: HikeRow[]): ComputedStats {
  const totalGain     = rows.reduce((sum, r) => sum + (parseFloat(r['Elevation-Gain(ft)']) || 0), 0)
  const totalDistance = rows.reduce((sum, r) => sum + (parseFloat(r['Distance(mi)']) || 0), 0)
  const totalTimeUp   = rows.reduce((sum, r) => sum + (parseFloat(r['Time-Up(min)']) || 0), 0)
  const totalTimeDown = rows.reduce((sum, r) => sum + (parseFloat(r['Time-Down(min)']) || 0), 0)
  const totalTimeHours = (totalTimeUp + totalTimeDown) / 60
  const states     = new Set(rows.map(r => r.Location?.trim()).filter(Boolean))
  const soloHikes  = rows.filter(r => r['Solo-Hike']?.trim() === 'TRUE').length
  const avgQ       = rows.reduce((sum, r) => sum + (parseFloat(r.Quality) || 0), 0) / rows.length
  const highest    = rows.reduce((best, r) => {
    return (parseFloat(r['Elevation(ft)']) || 0) > (parseFloat(best['Elevation(ft)']) || 0) ? r : best
  }, rows[0])

  return {
    uniqueAscents: rows.length,
    totalElevationGain: `${totalGain.toLocaleString()} ft`,
    totalDistance: `${totalDistance.toFixed(0)} mi`,
    totalTimeOnMountain: `${totalTimeHours.toFixed(0)} hrs`,
    statesVisited: states.size,
    soloHikes,
    highestPeak: highest
      ? `${highest.PeakPointName} (${parseFloat(highest['Elevation(ft)']).toLocaleString()} ft)`
      : '—',
    avgQuality: `${avgQ.toFixed(1)} / 10`,
  }
}

const statCards = (stats: ComputedStats) => [
  {
    label: 'Unique Ascents',
    value: stats.uniqueAscents.toString(),
    color: 'var(--accent)',
    desc: 'Total peaks summited'
  },
  {
    label: 'True Elevation Gained',
    value: stats.totalElevationGain,
    color: 'var(--accent-2)',
    desc: 'Vertical feet from trailhead'
  },
  {
    label: 'Distance Traveled',
    value: stats.totalDistance,
    color: 'var(--accent-3)',
    desc: 'Total miles on trail'
  },
  {
    label: 'Time on Mountain',
    value: stats.totalTimeOnMountain,
    color: 'var(--accent-4)',
    desc: 'Combined up & down time'
  },
  {
    label: 'States Explored',
    value: stats.statesVisited.toString(),
    color: 'var(--accent)',
    desc: 'Unique states & regions'
  },
  {
    label: 'Solo Hikes',
    value: stats.soloHikes.toString(),
    color: 'var(--accent-2)',
    desc: 'Completed alone'
  },
  {
    label: 'Highest Peak',
    value: stats.highestPeak,
    color: 'var(--accent-3)',
    desc: 'Top elevation reached',
    wide: true
  },
  {
    label: 'Avg Quality',
    value: stats.avgQuality,
    color: 'var(--accent-4)',
    desc: 'Self-rated experience'
  },
]

export function StatsMap() {
  const [stats, setStats] = useState<ComputedStats | null>(null)
  const [peaks, setPeaks] = useState<HikeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    fetch('/hikes.csv')
      .then(res => {
        if (!res.ok) throw new Error('Could not load hikes.csv')
        return res.text()
      })
      .then(text => {
        const rows = parseCSV(text)
        setStats(computeStats(rows))
        setPeaks(rows)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!peaks.length || mapLoaded) return

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      // @ts-ignore
      if (window.L) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
      script.crossOrigin = ''
      script.onload = () => initMap()
      document.head.appendChild(script)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      link.crossOrigin = ''
      document.head.appendChild(link)
    }

    const initMap = () => {
      // @ts-ignore
      const L = window.L
      if (!L) return

      const map = L.map('peak-map', {
        center: [39.8283, -98.5795], // Center of US
        zoom: 4,
        scrollWheelZoom: true
      })

      // Use a classical/muted tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map)

      // Custom marker icon
      const createIcon = (color: string) => {
        return L.divIcon({
          html: `<div style="
            width: 12px;
            height: 12px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          className: '',
          iconSize: [12, 12]
        })
      }

      // Add markers for each peak
      peaks.forEach(peak => {
        const lat = parseFloat(peak.Lat)
        const lng = parseFloat(peak.Long)
        
        if (isNaN(lat) || isNaN(lng)) return

        // Color by quality rating
        const quality = parseFloat(peak.Quality) || 0
        const color = quality >= 7 ? '#8B7355' : quality >= 5 ? '#A0634A' : '#D4A574'

        const marker = L.marker([lat, lng], { icon: createIcon(color) }).addTo(map)

        const elevation = parseFloat(peak['Elevation(ft)']) || 0
        const gain = parseFloat(peak['Elevation-Gain(ft)']) || 0
        
        marker.bindPopup(`
          <div style="font-family: 'Crimson Text', serif; min-width: 200px;">
            <div style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #3B3531;">
              ${peak.PeakPointName}
            </div>
            <div style="font-size: 13px; color: #3B3531; opacity: 0.8; line-height: 1.6;">
              <div><strong>Elevation:</strong> ${elevation.toLocaleString()} ft</div>
              <div><strong>Gain:</strong> ${gain.toLocaleString()} ft</div>
              <div><strong>Location:</strong> ${peak.Location}</div>
              <div><strong>Date:</strong> ${peak.AscentDate}</div>
              <div><strong>Quality:</strong> ${quality}/10</div>
              ${peak['Solo-Hike'] === 'TRUE' ? '<div style="color: #A0634A; margin-top: 4px;">✓ Solo</div>' : ''}
            </div>
          </div>
        `)
      })

      setMapLoaded(true)
    }

    loadLeaflet()
  }, [peaks, mapLoaded])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="section-title">Stats & Map</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          A living record of accumulated ascents, distances, and time spent in the field.
          All figures computed automatically from the expedition log.
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <div
          className="box-header"
          style={{ borderLeft: '4px solid var(--accent-2)', marginBottom: '1.5rem', borderRadius: '4px 4px 0 0' }}
        >
          Stats Snapshot
        </div>

        {loading && (
          <div className="text-sm text-[var(--text-muted)] italic py-8 text-center">
            Loading expedition data...
          </div>
        )}

        {error && (
          <div className="text-sm text-[var(--accent-2)] py-8 text-center">
            Could not load data: {error}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards(stats).map((card, i) => (
              <div
                key={i}
                className={`stat-card entry-card ${i % 3 === 0 ? 'journal' : i % 3 === 1 ? 'adventure' : 'project'}`}
                style={{
                  padding: '1.25rem 1rem',
                  gridColumn: card.wide ? 'span 2' : 'span 1',
                  textAlign: 'center'
                }}
              >
                <div className="entry-dot"></div>
                <div
                  className="stat-number"
                  style={{
                    color: card.color,
                    fontSize: card.wide ? '1.2rem' : '1.75rem',
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-header)',
                    fontWeight: 400,
                    lineHeight: 1.2
                  }}
                >
                  {card.value}
                </div>
                <div className="stat-label" style={{ marginBottom: '0.25rem' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="box update-box">
        <div className="box-header">Interactive Map</div>
        <div className="p-6">
          {loading ? (
            <div className="text-sm text-[var(--text-muted)] italic py-12 text-center">
              Loading map data...
            </div>
          ) : (
            <div>
              <div 
                id="peak-map" 
                style={{ 
                  height: '500px', 
                  borderRadius: '4px',
                  border: '1px solid var(--border)'
                }}
              />
              <div className="text-xs text-[var(--text-muted)] mt-3 italic text-center">
                {stats?.uniqueAscents} peaks plotted • Click any marker for details • Colors indicate quality rating
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
