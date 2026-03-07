import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const MOSS   = '#2C3A2E'
const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const STONE  = '#8B7355'
const INK    = '#1A2318'
const MUTED  = '#A89070'

interface GalleryPhoto {
  id: string
  image_url: string
  caption: string
  date: string
}

function PhotoCard({ photo }: { photo: GalleryPhoto }) {
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded]   = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4 / 3',
        background: MOSS,
        cursor: 'pointer',
        border: '1px solid rgba(139,115,85,0.15)',
        transition: 'box-shadow 0.3s ease',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Image */}
      <img
        src={photo.image_url}
        alt={photo.caption}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          transition: 'transform 0.5s ease, filter 0.4s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          filter: hovered ? 'brightness(0.75) saturate(0.9)' : 'brightness(0.88) saturate(0.8)',
          opacity: loaded ? 1 : 0,
        }}
      />

      {/* Loading placeholder */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${MOSS}, ${INK})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'rgba(237,228,208,0.2)', fontSize: '1.5rem' }}>⛰</span>
        </div>
      )}

      {/* Caption overlay — appears on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,35,24,0.92) 0%, transparent 55%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '1.2rem',
        gap: '0.3rem',
      }}>
        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: '0.85rem',
          color: PARCH,
          margin: 0,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}>
          {photo.caption}
        </p>
        {photo.date && (
          <span style={{
            fontFamily: "'Lora', serif",
            fontSize: '0.65rem',
            color: STONE,
            letterSpacing: '0.1em',
          }}>
            {new Date(photo.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Sienna accent line on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px', background: SIENNA,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.3s ease',
        transformOrigin: 'left',
      }} />
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      gridColumn: '1 / -1', padding: '6rem 2rem', textAlign: 'center',
      border: '1px dashed rgba(139,115,85,0.3)', background: 'rgba(44,58,46,0.3)',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.4 }}>📷</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: PARCH, margin: '0 0 0.6rem' }}>
        No photos yet
      </h3>
      <p style={{ fontFamily: "'Lora', serif", fontSize: '0.85rem', color: MUTED, fontStyle: 'italic', maxWidth: '420px', margin: '0 auto' }}>
        Add rows to your <code style={{ color: SIENNA }}>gallery</code> table in Supabase with an <code style={{ color: SIENNA }}>image_url</code>, caption, and date.
      </p>
    </div>
  )
}

export default function GalleryPage() {
  const [photos, setPhotos]   = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }: { data: any; error: any }) => {
        if (error) setError(error.message)
        else setPhotos(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ background: INK, minHeight: '100vh', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{ padding: '4rem 2rem 3rem', textAlign: 'center', borderBottom: `3px solid ${SIENNA}` }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: SIENNA, marginBottom: '0.8rem' }}>
          Visual record
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: PARCH, margin: 0, letterSpacing: '-0.02em' }}>
          Gallery
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: MUTED, fontStyle: 'italic', marginTop: '0.8rem' }}>
          {photos.length > 0 ? `${photos.length} photos from the field` : 'From the mountains'}
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', fontFamily: "'Lora', serif", color: STONE, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading photos...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Lora', serif", color: SIENNA, fontSize: '0.9rem' }}>
            Error: {error}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {photos.length === 0
              ? <EmptyState />
              : photos.map(photo => <PhotoCard key={photo.id} photo={photo} />)
            }
          </div>
        )}
      </div>

    </div>
  )
}
