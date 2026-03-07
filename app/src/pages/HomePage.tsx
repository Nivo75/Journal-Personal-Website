import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCanvas from '../components/hero/HeroCanvas'
import { supabase } from '../lib/supabaseClient'
import { loadPeaks, type Peak } from '../lib/peakData'

// ── Palette ──────────────────────────────────────────────
const MOSS   = '#2C3A2E'
const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const PARCH2 = '#D4C9A8'
const STONE  = '#8B7355'
const CREAM  = '#F5EFE0'
const INK    = '#1A2318'
const MUTED  = '#A89070'

// ── Types ─────────────────────────────────────────────────
interface Adventure {
  id: string
  title: string
  location: string
  summary: string
  day_count?: number
  trip_type?: string
  cover_image?: string
  date?: string
}

interface GalleryPhoto {
  id: string
  image_url: string
  caption: string
  date: string
}

// ── Shared section header ─────────────────────────────────
function SectionHeader({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '2.5rem' }}>
      <div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: SIENNA, marginBottom: '0.4rem' }}>
          {eyebrow}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: dark ? PARCH : MOSS, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(237,228,208,0.2)' : PARCH2, maxWidth: '120px' }} />
    </div>
  )
}

// ── View all link ─────────────────────────────────────────
function ViewAll({ to, label, dark = false }: { to: string; label: string; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
      <Link to={to} style={{
        fontFamily: "'Lora', serif", fontSize: '0.75rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: dark ? MUTED : SIENNA,
        textDecoration: 'none', borderBottom: `1px solid ${dark ? 'rgba(196,98,45,0.4)' : 'rgba(196,98,45,0.4)'}`,
        paddingBottom: '2px', transition: 'color 0.2s',
      }}>
        {label} →
      </Link>
    </div>
  )
}

// ── Adventures section ────────────────────────────────────
function AdventuresSection() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [activeLocation, setActiveLocation] = useState('All')

  useEffect(() => {
    supabase.from('adventures').select('*').order('date', { ascending: false })
      .then(({ data }) => {
        if (!data) return
        setAdventures(data)
        // Build unique location list from data
        const locs = Array.from(new Set(data.map((a: Adventure) => a.location).filter(Boolean)))
        setAllLocations(locs)
      })
  }, [])

  const filtered = activeLocation === 'All'
    ? adventures
    : adventures.filter(a => a.location === activeLocation)

  const filterLocations = ['All', ...allLocations]

  return (
    <section style={{ background: CREAM, padding: '5rem 3rem' }}>
      <SectionHeader eyebrow="Field Reports" title="Recent Adventures" />

      {/* Location filter */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {filterLocations.map(loc => (
          <button key={loc} onClick={() => setActiveLocation(loc)} style={{
            fontFamily: "'Lora', serif", fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '0.5rem 1.1rem',
            border: `1px solid ${activeLocation === loc ? SIENNA : PARCH2}`,
            background: activeLocation === loc ? MOSS : 'transparent',
            color: activeLocation === loc ? PARCH : STONE,
            cursor: 'pointer', transition: 'all 0.2s', borderRadius: '2px',
          }}>
            {loc}
          </button>
        ))}
      </div>

      {/* Adventure cards grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', fontFamily: "'Lora', serif", color: STONE, fontStyle: 'italic' }}>
          No adventures yet — add entries in Supabase to populate this section.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto',
          gap: '1.5px',
          background: PARCH2,
          border: `1.5px solid ${PARCH2}`,
        }}>
          {filtered.slice(0, 5).map((adv, i) => (
            <AdventureCard key={adv.id} adventure={adv} featured={i === 0} />
          ))}
        </div>
      )}

      <ViewAll to="/adventures" label="View all adventures" />
    </section>
  )
}

function AdventureCard({ adventure, featured }: { adventure: Adventure; featured: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        gridColumn: featured ? 'span 1' : 'span 1',
        gridRow: featured ? 'span 2' : 'span 1',
        minHeight: featured ? '440px' : '220px',
        background: MOSS,
      }}
    >
      {adventure.cover_image && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${adventure.cover_image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,35,24,0.9) 0%, transparent 60%)',
      }} />
      {!adventure.cover_image && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(45deg, ${PARCH} 0, ${PARCH} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '12px 12px',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0, padding: '1.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.4rem',
      }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: SIENNA }}>
          {adventure.location}
          {adventure.day_count ? ` · ${adventure.day_count}d` : ''}
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: featured ? '1.8rem' : '1.2rem',
          fontWeight: 700, color: PARCH, lineHeight: 1.15,
        }}>
          {adventure.title}
        </div>
        {(featured || hovered) && (
          <p style={{ fontFamily: "'Lora', serif", fontSize: '0.82rem', color: 'rgba(237,228,208,0.7)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
            {adventure.summary}
          </p>
        )}
        {adventure.date && (
          <div style={{ fontFamily: "'Lora', serif", fontSize: '0.68rem', color: STONE }}>
            {new Date(adventure.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Summit Ledger section ─────────────────────────────────
function SummitLedgerSection({ peaks }: { peaks: Peak[] }) {
  if (peaks.length === 0) return null

  // Peaks by state
  const byState = peaks.reduce((acc, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topStates = Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxState = topStates[0]?.[1] || 1

  // Peaks by year
  const byYear = peaks.reduce((acc, p) => {
    const yr = p.date?.split('/')[2] ? '20' + p.date.split('/')[2] : null
    if (yr) acc[yr] = (acc[yr] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const years = Object.entries(byYear).sort((a, b) => a[0].localeCompare(b[0]))
  const maxYear = Math.max(...years.map(([, c]) => c))

  // High prominence peaks
  const highProm = peaks.filter(p => p.prominence >= 4000).sort((a, b) => b.prominence - a.prominence).slice(0, 5)

  const cardStyle = {
    background: 'rgba(237,228,208,0.06)',
    border: '1px solid rgba(237,228,208,0.12)',
    borderRadius: '3px', padding: '1.8rem',
    position: 'relative' as const, overflow: 'hidden',
  }

  return (
    <section style={{ background: MOSS, padding: '5rem 3rem', position: 'relative', overflow: 'hidden' }}>
      {/* topo bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg, ${PARCH} 0, ${PARCH} 1px, transparent 0, transparent 40px),
                          repeating-linear-gradient(90deg, ${PARCH} 0, ${PARCH} 1px, transparent 0, transparent 40px)`,
      }} />

      <SectionHeader eyebrow="By the Numbers" title="Summit Ledger" dark />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Card 1 — by state */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: SIENNA, opacity: 0.7 }} />
          <div style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, marginBottom: '1.2rem' }}>
            Peaks by State
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {topStates.map(([state, count]) => (
              <div key={state}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', color: PARCH2 }}>{state}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.75rem', color: PARCH, fontStyle: 'italic' }}>{count} peaks</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(237,228,208,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxState) * 100}%`, background: `linear-gradient(to right, ${SIENNA}, #D4784A)`, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2 — summits by year */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: SIENNA, opacity: 0.7 }} />
          <div style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, marginBottom: '1.2rem' }}>
            Summits by Year
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {years.map(([yr, count]) => (
              <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.78rem', color: MUTED, width: '36px', flexShrink: 0 }}>{yr}</span>
                <div style={{ flex: 1, height: '3px', background: 'rgba(237,228,208,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxYear) * 100}%`, background: `linear-gradient(to right, ${SIENNA}, #D4784A)`, borderRadius: '2px' }} />
                </div>
                <span style={{ fontFamily: "'Lora', serif", fontSize: '0.68rem', color: STONE, width: '24px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 — high prominence peaks */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: SIENNA, opacity: 0.7 }} />
          <div style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, marginBottom: '1.2rem' }}>
            High Prominence · 4,000ft+
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {highProm.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.7rem', color: STONE, width: '16px', flexShrink: 0 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: '0.8rem', color: PARCH2, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', color: STONE, marginTop: '1px' }}>
                    {p.prominence.toLocaleString()}ft prom · {p.elev.toLocaleString()}ft elev
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <ViewAll to="/stats" label="Full stats dashboard" dark />
    </section>
  )
}

// ── Gallery preview section ───────────────────────────────
function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])

  useEffect(() => {
    supabase.from('gallery').select('*').order('date', { ascending: false }).limit(7)
      .then(({ data }) => { if (data) setPhotos(data) })
  }, [])

  return (
    <section style={{ background: INK, padding: '5rem 3rem' }}>
      <SectionHeader eyebrow="Visual Record" title="From the Field" dark />

      {photos.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', fontFamily: "'Lora', serif", color: STONE, fontStyle: 'italic' }}>
          Add photos to your gallery table in Supabase to populate this section.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: '200px 140px',
          gap: '3px',
        }}>
          {photos.slice(0, 7).map((photo, i) => (
            <GalleryCell key={photo.id} photo={photo} index={i} />
          ))}
        </div>
      )}

      <ViewAll to="/gallery" label="Browse full gallery" dark />
    </section>
  )
}

function GalleryCell({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isLarge = index === 0
  const isWide  = index === 3

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: isLarge ? 'span 2' : isWide ? 'span 2' : 'span 1',
        gridRow: isLarge ? 'span 2' : 'span 1',
        overflow: 'hidden', position: 'relative', cursor: 'pointer',
        background: MOSS,
      }}
    >
      <img src={photo.image_url} alt={photo.caption} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transition: 'transform 0.5s ease, filter 0.4s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        filter: hovered ? 'saturate(0.9) brightness(0.75)' : 'saturate(0.65) brightness(0.7)',
      }} />
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,35,24,0.85) 0%, transparent 55%)',
          display: 'flex', alignItems: 'flex-end', padding: '1rem',
        }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: '0.78rem', color: PARCH, fontStyle: 'italic', margin: 0 }}>
            {photo.caption}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: INK, borderTop: '1px solid rgba(139,115,85,0.2)',
      padding: '2.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontStyle: 'italic', color: STONE }}>
        Life Not Lived
      </div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: STONE, fontStyle: 'italic', letterSpacing: '0.1em' }}>
        48.3°N, 121.7°W — last summit
      </div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.68rem', color: 'rgba(139,115,85,0.5)', fontStyle: 'italic' }}>
        122 peaks · counting
      </div>
    </footer>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function HomePage() {
  const [peaks, setPeaks] = useState<Peak[]>([])

  useEffect(() => {
    loadPeaks().then(setPeaks)
  }, [])

  // Derived stats from real CSV data
  const isStateCode = (loc: string) => /^[A-Z]{2}$/.test(loc.trim())
  const countries = peaks.length > 0
    ? new Set(peaks.map(p => isStateCode(p.location) ? 'USA' : p.location)).size
    : 0
  const states = peaks.length > 0
    ? new Set(peaks.filter(p => isStateCode(p.location)).map(p => p.location)).size
    : 0
  const highestPeak = peaks.length > 0
    ? peaks.reduce((best, p) => p.elev > best.elev ? p : best, peaks[0])
    : null

  return (
    <div style={{ background: CREAM }}>

      {/* 1 — Hero */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
        <HeroCanvas />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: `radial-gradient(ellipse at center, transparent 35%, rgba(26,35,24,0.55) 100%),
                       linear-gradient(to bottom, rgba(26,35,24,0.5) 0%, transparent 20%, transparent 70%, rgba(26,35,24,0.8) 100%)`,
        }} />
        <div style={{
          position: 'absolute', zIndex: 3, top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
          pointerEvents: 'none', animation: 'heroFade 1.2s ease forwards',
        }}>
          <div style={{
            fontFamily: "'Lora', serif", fontSize: '0.72rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: '#D4784A', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
          }}>
            <span style={{ display: 'block', height: '1px', width: '40px', background: SIENNA, opacity: 0.7 }} />
            {peaks.length} summits · {states} states · {countries} {countries === 1 ? 'country' : 'countries'}
            <span style={{ display: 'block', height: '1px', width: '40px', background: SIENNA, opacity: 0.7 }} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 900, color: PARCH, lineHeight: 0.92, letterSpacing: '-0.02em',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)', margin: 0,
          }}>
            Life Not<br />
            <em style={{ fontStyle: 'italic', color: PARCH2, fontWeight: 400 }}>Lived</em>
          </h1>
          <p style={{
            fontFamily: "'Lora', serif", fontSize: '1.05rem', color: PARCH2,
            fontStyle: 'italic', opacity: 0.85, marginTop: '1.2rem', letterSpacing: '0.03em',
          }}>
            A peakbagger's record of vertical obsession
          </p>
        </div>
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: PARCH2, opacity: 0.7, animation: 'scrollBounce 2s infinite',
        }}>
          <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Explore</span>
          <div style={{ width: '1px', height: '28px', background: `linear-gradient(to bottom, ${PARCH2}, transparent)` }} />
        </div>
      </section>

      {/* 2 — Stats Band */}
      <div style={{ background: MOSS, borderTop: `3px solid ${SIENNA}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { num: '122', unit: 'peaks', label: 'Summits Reached',  sub: 'across 7 mountain ranges'      },
          { num: '193', unit: 'k ft',  label: 'Total Elevation',  sub: '≈ 6.5× Everest from sea level' },
          { num: '686', unit: 'mi',    label: 'Distance Covered', sub: 'Los Angeles → Seattle'          },
          { num: highestPeak ? Math.round(highestPeak.elev / 1000).toString() : '—', unit: 'k ft', label: 'Highest Summit', sub: highestPeak ? `${highestPeak.name}, ${highestPeak.location}` : '—' },
        ].map(({ num, unit, label, sub }, i) => (
          <div key={i} style={{
            padding: '3.5rem 2rem', borderRight: i < 3 ? '1px solid rgba(139,115,85,0.25)' : 'none',
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 900, color: PARCH, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {num}
              <span style={{ fontSize: '0.55em', fontWeight: 400, color: '#D4784A', fontStyle: 'italic' }}> {unit}</span>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED }}>{label}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', color: STONE, fontStyle: 'italic', marginTop: '0.2rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* 3 — Recent Adventures */}
      <AdventuresSection />

      {/* 4 — Summit Ledger */}
      <SummitLedgerSection peaks={peaks} />

      {/* 5 — Gallery Preview */}
      <GallerySection />

      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(5px); }
        }
      `}</style>
    </div>
  )
}
