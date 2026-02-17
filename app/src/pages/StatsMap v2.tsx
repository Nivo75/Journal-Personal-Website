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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/hikes.csv')
      .then(res => {
        if (!res.ok) throw new Error('Could not load hikes.csv')
        return res.text()
      })
      .then(text => {
        const rows = parseCSV(text)
        setStats(computeStats(rows))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

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

      {/* Map Placeholder */}
      <div className="box update-box">
        <div className="box-header">Interactive Map</div>
        <div className="p-6">
          <div
            className="text-center py-12 text-sm text-[var(--text-muted)] italic"
            style={{
              border: '2px dashed var(--border)',
              borderRadius: '4px'
            }}
          >
            Map layer coming soon — will display pins for all {stats?.uniqueAscents ?? '—'} logged ascents.
            <br />
            <span className="text-xs mt-2 block">Pins will include peak name, elevation, date, and quality rating.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
