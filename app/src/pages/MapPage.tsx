import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { loadPeaks, type Peak } from '../lib/peakData'

const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const STONE  = '#8B7355'
const INK    = '#1A2318'
const MUTED  = '#A89070'

function qualityStars(q: number) {
  return '★'.repeat(Math.max(0, Math.min(5, q))) + '☆'.repeat(Math.max(0, 5 - q))
}

type FilterType = 'prominence' | 'elevation'

const FILTER_THRESHOLDS: Record<FilterType, { label: string; min: number }[]> = {
  prominence: [
    { label: 'All',      min: 0    },
    { label: '300ft+',   min: 300  },
    { label: '1,000ft+', min: 1000 },
    { label: '2,000ft+', min: 2000 },
    { label: '4,000ft+', min: 4000 },
  ],
  elevation: [
    { label: 'All',       min: 0     },
    { label: '4,000ft+',  min: 4000  },
    { label: '8,000ft+',  min: 8000  },
    { label: '11,000ft+', min: 11000 },
    { label: '14,000ft+', min: 14000 },
  ],
}

const BAR_STYLE = {
  background: 'rgba(26,35,24,0.92)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(196,98,45,0.25)',
  padding: '0.75rem 2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
  zIndex: 10,
  flexWrap: 'wrap' as const,
}

export default function MapPage() {
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const [peaks, setPeaks]             = useState<Peak[]>([])
  const [loading, setLoading]         = useState(true)
  const [filterType, setFilterType]   = useState<FilterType>('prominence')
  const [thresholdIdx, setThresholdIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)

  // When filter type changes, reset threshold to 0 (All)
  function handleTypeChange(type: FilterType) {
    setFilterType(type)
    setThresholdIdx(0)
  }

  useEffect(() => {
    loadPeaks().then(data => { setPeaks(data); setLoading(false) })
  }, [])

  // Init map once
  useEffect(() => {
    if (loading || mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center: [44, -112], zoom: 5, zoomControl: false,
    })
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri', maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 150)
    return () => { map.remove(); mapRef.current = null }
  }, [loading])

  // Update markers on filter change
  useEffect(() => {
    const map = mapRef.current
    if (!map || peaks.length === 0) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const minVal = FILTER_THRESHOLDS[filterType][thresholdIdx].min
    const filtered = peaks.filter(p =>
      filterType === 'prominence'
        ? p.prominence >= minVal
        : p.elev >= minVal
    )
    setVisibleCount(filtered.length)

    filtered.forEach(peak => {
      if (!peak.lat || !peak.lng) return

      const isHighProm = peak.prominence >= 4000
      const isHighElev = peak.elev > 14000
      const size = isHighProm ? 12 : 8

      const dot = L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;
          background:${isHighElev ? PARCH : SIENNA};
          border:2px solid rgba(237,228,208,${isHighProm ? '0.7' : '0.4'});
          border-radius:50%;
          box-shadow:0 0 ${isHighProm ? '8px' : '4px'} rgba(196,98,45,${isHighProm ? '0.6' : '0.3'});
          cursor:pointer;
        "></div>`,
        iconSize: [size, size], iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker([peak.lat, peak.lng], { icon: dot })
      marker.bindPopup(`
        <div style="font-family:'Lora',Georgia,serif;min-width:200px;">
          <div style="font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:${SIENNA};margin-bottom:0.4rem;">${peak.location}</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:700;color:${PARCH};margin-bottom:0.8rem;line-height:1.2;">${peak.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;padding-top:0.6rem;border-top:1px solid rgba(139,115,85,0.3);">
            <div>
              <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:${STONE};margin-bottom:2px;">Elevation</div>
              <div style="font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:${PARCH};">${peak.elev.toLocaleString()} ft</div>
            </div>
            <div>
              <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:${STONE};margin-bottom:2px;">Prominence</div>
              <div style="font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:${PARCH};">${peak.prominence.toLocaleString()} ft</div>
            </div>
            <div>
              <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:${STONE};margin-bottom:2px;">Gain</div>
              <div style="font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:${PARCH};">+${peak.gain.toLocaleString()} ft</div>
            </div>
            <div>
              <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:${STONE};margin-bottom:2px;">Distance</div>
              <div style="font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:${PARCH};">${peak.distance} mi</div>
            </div>
          </div>
          <div style="margin-top:0.7rem;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:0.7rem;color:${MUTED};font-style:italic;">${peak.date}</div>
            <div style="color:${SIENNA};font-size:0.75rem;">${qualityStars(peak.quality)}</div>
          </div>
        </div>
      `, { maxWidth: 260, className: 'lnl-popup' })

      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [peaks, filterType, thresholdIdx])

  const thresholds = FILTER_THRESHOLDS[filterType]

  const btnStyle = (active: boolean) => ({
    fontFamily: "'Lora', serif",
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '0.3rem 0.85rem',
    border: `1px solid ${active ? SIENNA : 'rgba(139,115,85,0.4)'}`,
    background: active ? 'rgba(196,98,45,0.15)' : 'transparent',
    color: active ? PARCH : MUTED,
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'all 0.2s',
  })

  const divider = (
    <div style={{ width: '1px', height: '20px', background: 'rgba(139,115,85,0.3)', flexShrink: 0 }} />
  )

  return (
    <div style={{ background: INK, height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>

      <style>{`
        .lnl-popup .leaflet-popup-content-wrapper {
          background: rgba(26,35,24,0.95) !important;
          border: 1px solid rgba(196,98,45,0.4) !important;
          border-radius: 3px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(12px);
        }
        .lnl-popup .leaflet-popup-tip { background: rgba(26,35,24,0.95) !important; }
        .lnl-popup .leaflet-popup-content { margin: 14px 16px !important; }
        .leaflet-container { background: #1a2318 !important; }
      `}</style>

      {/* Filter bar */}
      <div style={BAR_STYLE}>

        {/* Type toggle — Prominence / Elevation */}
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: STONE, flexShrink: 0 }}>
          Filter by
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['prominence', 'elevation'] as FilterType[]).map(type => (
            <button key={type} onClick={() => handleTypeChange(type)} style={btnStyle(filterType === type)}>
              {type}
            </button>
          ))}
        </div>

        {divider}

        {/* Threshold buttons — reactive to type */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {thresholds.map((t, i) => (
            <button key={i} onClick={() => setThresholdIdx(i)} style={btnStyle(thresholdIdx === i)}>
              {t.label}
            </button>
          ))}
        </div>

        {divider}

        {/* Peak count */}
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: STONE, fontStyle: 'italic' }}>
          {loading ? 'Loading...' : `${visibleCount} peaks`}
        </span>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PARCH, border: '2px solid rgba(237,228,208,0.7)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE }}>14,000ft+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SIENNA, border: '2px solid rgba(237,228,208,0.4)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE }}>Other</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: INK }}>
            <span style={{ fontFamily: "'Lora', serif", color: STONE, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Loading peaks...
            </span>
          </div>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Footer — matches filter bar height */}
      <div style={{
        ...BAR_STYLE,
        borderBottom: 'none',
        borderTop: '1px solid rgba(196,98,45,0.25)',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: STONE }}>
          Life Not Lived · Peakbagging Chronicles
        </span>
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: MUTED, fontStyle: 'italic' }}>
          {peaks.length > 0 ? `${peaks.length} summits logged` : ''}
        </span>
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE, letterSpacing: '0.1em' }}>
          48°N · 121°W
        </span>
      </div>

    </div>
  )
}
