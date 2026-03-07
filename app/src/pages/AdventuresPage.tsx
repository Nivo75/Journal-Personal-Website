import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const MOSS   = '#2C3A2E'
const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const STONE  = '#8B7355'
const CREAM  = '#F5EFE0'
const INK    = '#1A2318'
const MUTED  = '#A89070'

interface Adventure {
  id: string
  title: string
  location: string
  summary: string
  day_count?: number
  body?: string
  peaks_included?: string[]
  trip_type?: 'day hike' | 'overnight' | 'multi-day' | 'expedition'
  cover_image?: string
  date?: string
  created_at: string
}

const TRIP_TYPE_COLOR: Record<string, string> = {
  'day hike':   '#6B9E6B',
  'overnight':  '#C4A62D',
  'multi-day':  '#C4622D',
  'expedition': '#8B2FC4',
}

function TripBadge({ type }: { type?: string }) {
  if (!type) return null
  return (
    <span style={{
      fontFamily: "'Lora', serif",
      fontSize: '0.62rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: TRIP_TYPE_COLOR[type] || SIENNA,
      border: `1px solid ${TRIP_TYPE_COLOR[type] || SIENNA}`,
      padding: '0.2rem 0.6rem',
      borderRadius: '2px',
    }}>
      {type}
    </span>
  )
}

function AdventureCard({ adventure, featured = false }: { adventure: Adventure; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        gridColumn: featured ? 'span 2' : 'span 1',
        gridRow:    featured ? 'span 2' : 'span 1',
        minHeight:  featured ? '520px' : '280px',
        background: MOSS,
        border: '1px solid rgba(139,115,85,0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Cover image */}
      {adventure.cover_image && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${adventure.cover_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.6s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: adventure.cover_image
          ? 'linear-gradient(to top, rgba(26,35,24,0.95) 0%, rgba(26,35,24,0.4) 50%, transparent 100%)'
          : `linear-gradient(135deg, ${MOSS} 0%, ${INK} 100%)`,
      }} />

      {/* No image topo pattern */}
      {!adventure.cover_image && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(45deg, ${PARCH} 0, ${PARCH} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '12px 12px',
        }} />
      )}

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: featured ? '2rem' : '1.4rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        gap: '0.5rem',
      }}>
        {/* Date + badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.2rem' }}>
          {adventure.date && (
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: MUTED, letterSpacing: '0.1em' }}>
              {new Date(adventure.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          )}
          <TripBadge type={adventure.trip_type} />
          {adventure.day_count && (
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: STONE }}>
              {adventure.day_count} {adventure.day_count === 1 ? 'day' : 'days'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: featured ? 'clamp(1.6rem, 2.5vw, 2.2rem)' : '1.15rem',
          fontWeight: 700,
          color: PARCH,
          margin: 0,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}>
          {adventure.title}
        </h3>

        {/* Location */}
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.78rem', color: SIENNA, letterSpacing: '0.08em' }}>
          ◦ {adventure.location}
        </div>

        {/* Summary — always visible */}
        <p style={{
          fontFamily: "'Lora', serif", fontSize: '0.85rem',
          color: 'rgba(237,228,208,0.75)', fontStyle: 'italic',
          margin: '0.2rem 0 0', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: featured ? 4 : 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {adventure.summary}
        </p>

        {/* Peaks row — shown on hover or featured */}
        {(featured || hovered) && adventure.peaks_included && adventure.peaks_included.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(139,115,85,0.3)', paddingTop: '0.8rem', marginTop: '0.4rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Peaks:
            </span>
            {adventure.peaks_included.slice(0, 4).map(p => (
              <span key={p} style={{ fontFamily: "'Lora', serif", fontSize: '0.72rem', color: MUTED }}>
                {p}
              </span>
            ))}
            {adventure.peaks_included.length > 4 && (
              <span style={{ fontFamily: "'Lora', serif", fontSize: '0.72rem', color: STONE }}>
                +{adventure.peaks_included.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      gridColumn: '1 / -1', padding: '6rem 2rem', textAlign: 'center',
      border: '1px dashed rgba(139,115,85,0.3)', background: 'rgba(44,58,46,0.3)',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.4 }}>⛰</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: PARCH, margin: '0 0 0.6rem' }}>
        No adventures yet
      </h3>
      <p style={{ fontFamily: "'Lora', serif", fontSize: '0.85rem', color: MUTED, fontStyle: 'italic', maxWidth: '400px', margin: '0 auto' }}>
        Add entries to your <code style={{ color: SIENNA }}>adventures</code> table in Supabase to populate this page.
      </p>
    </div>
  )
}

export default function AdventuresPage() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('adventures')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setAdventures(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ background: INK, minHeight: '100vh', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{ background: INK, padding: '4rem 2rem 3rem', textAlign: 'center', borderBottom: `3px solid ${SIENNA}` }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: SIENNA, marginBottom: '0.8rem' }}>
          Field notes
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: PARCH, margin: 0, letterSpacing: '-0.02em' }}>
          Adventures
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: MUTED, fontStyle: 'italic', marginTop: '0.8rem' }}>
          {adventures.length > 0 ? `${adventures.length} expeditions documented` : 'Trip reports & expedition notes'}
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', fontFamily: "'Lora', serif", color: STONE, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading adventures...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Lora', serif", color: SIENNA, fontSize: '0.9rem' }}>
            Error: {error}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            gridAutoRows: '280px',
          }}>
            {adventures.length === 0
              ? <EmptyState />
              : adventures.map((adventure, i) => (
                  <AdventureCard key={adventure.id} adventure={adventure} featured={i === 0} />
                ))
            }
          </div>
        )}
      </div>

    </div>
  )
}
