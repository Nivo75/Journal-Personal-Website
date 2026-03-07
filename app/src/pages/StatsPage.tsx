import { useEffect, useState } from 'react'
import { loadPeaks, type Peak } from '../lib/peakData'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const MOSS   = '#2C3A2E'
const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const STONE  = '#8B7355'
const INK    = '#1A2318'
const MUTED  = '#A89070'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: INK, border: '1px solid rgba(196,98,45,0.4)', padding: '0.6rem 1rem', borderRadius: '3px', fontFamily: "'Lora', serif", fontSize: '0.8rem', color: PARCH }}>
      <div style={{ color: SIENNA, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{payload[0].value} peaks</div>
    </div>
  )
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: MOSS, border: '1px solid rgba(139,115,85,0.2)', borderTop: `3px solid ${SIENNA}`, padding: '2rem 2rem 2.5rem' }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: PARCH, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
        {subtitle && <p style={{ fontFamily: "'Lora', serif", fontSize: '0.78rem', color: MUTED, fontStyle: 'italic', margin: '0.3rem 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function StatsPage() {
  const [peaks, setPeaks]           = useState<Peak[]>([])
  const [loading, setLoading]       = useState(true)
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  useEffect(() => {
    loadPeaks().then(data => { setPeaks(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div style={{ background: INK, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Lora', serif", color: STONE, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading data...</span>
      </div>
    )
  }

  // ── PEAKS BY STATE ──
  const stateCounts = peaks.reduce<Record<string, number>>((acc, p) => {
    const state = p.location || 'Unknown'
    acc[state]  = (acc[state] || 0) + 1
    return acc
  }, {})
  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)

  // ── PEAKS PER YEAR ──
  const yearCounts = peaks.reduce<Record<string, number>>((acc, p) => {
    if (!p.date) return acc
    const parts = p.date.split('/')
    if (parts.length < 3) return acc
    let yr = parts[2]
    if (yr.length === 2) yr = '20' + yr
    acc[yr] = (acc[yr] || 0) + 1
    return acc
  }, {})
  const yearData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year))

  // ── HIGH PROMINENCE PEAKS (4000ft+) ──
  const prominentPeaks = peaks
    .filter(p => p.prominence >= 4000)
    .sort((a, b) => b.prominence - a.prominence)
    .slice(0, 20)

  const maxElev = Math.max(...peaks.map(p => p.elev))

  return (
    <div style={{ background: INK, minHeight: '100vh', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{ background: INK, padding: '4rem 2rem 3rem', textAlign: 'center', borderBottom: `3px solid ${SIENNA}` }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: SIENNA, marginBottom: '0.8rem' }}>
          By the numbers
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: PARCH, margin: 0, letterSpacing: '-0.02em' }}>
          Stats &amp; Data
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: MUTED, fontStyle: 'italic', marginTop: '0.8rem' }}>
          {peaks.length} summits logged across {Object.keys(stateCounts).length} states
        </p>
      </div>

      {/* Charts */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>

        {/* Peaks by State */}
        <Card title="Peaks by State" subtitle={`${Object.keys(stateCounts).length} states explored`}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stateData} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontFamily: "'Lora', serif", fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="state" width={36} tick={{ fontFamily: "'Lora', serif", fontSize: 12, fill: PARCH }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(196,98,45,0.08)' }} />
              <Bar dataKey="count" radius={[0, 2, 2, 0]}
                onMouseEnter={(d: any) => setHoveredBar(d.state)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {stateData.map(entry => (
                  <Cell key={entry.state} fill={hoveredBar === entry.state ? '#D4784A' : SIENNA} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Peaks per Year */}
        <Card title="Summits per Year" subtitle="Peaks bagged each calendar year">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={yearData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontFamily: "'Lora', serif", fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'Lora', serif", fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(196,98,45,0.08)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}
                onMouseEnter={(d: any) => setHoveredBar(d.year)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {yearData.map(entry => (
                  <Cell key={entry.year} fill={hoveredBar === entry.year ? '#D4784A' : SIENNA} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* High Prominence Peaks */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Card title="High Prominence Peaks" subtitle={`Peaks with 4,000+ ft of topographic prominence · ${prominentPeaks.length} summits`}>
            {prominentPeaks.length === 0 ? (
              <p style={{ fontFamily: "'Lora', serif", color: MUTED, fontStyle: 'italic', fontSize: '0.9rem' }}>
                No peaks with 4,000+ ft prominence found — check that the <code>Prominence(ft)</code> column is loading correctly.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.8rem' }}>
                {prominentPeaks.map((peak, i) => (
                  <div key={peak.name} style={{ display: 'grid', gridTemplateColumns: '1.6rem 1fr auto', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.75rem', color: STONE, textAlign: 'right' }}>
                      {i + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.85rem', color: PARCH, marginBottom: '0.3rem' }}>
                        {peak.name}
                        <span style={{ color: STONE, fontSize: '0.75rem', marginLeft: '0.5rem' }}>{peak.location}</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(139,115,85,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(peak.elev / maxElev) * 100}%`, background: SIENNA, borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.78rem', color: MUTED, whiteSpace: 'nowrap' }}>{peak.elev.toLocaleString()} ft</div>
                      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: STONE, whiteSpace: 'nowrap' }}>{peak.prominence.toLocaleString()} prom</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}
