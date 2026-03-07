import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { loadPeaks, type Peak } from '../lib/peakData'

const SIENNA = '#C4622D'
const PARCH  = '#EDE4D0'
const STONE  = '#8B7355'
const INK    = '#1A2318'
const MUTED  = '#A89070'

const PROMINENCE_FILTERS = [
  { label: 'All Peaks',  min: 0     },
  { label: '300ft+',     min: 300   },
  { label: '1,000ft+',   min: 1000  },
  { label: '2,000ft+',   min: 2000  },
  { label: '4,000ft+',   min: 4000  },
]

function qualityStars(q: number) {
  return '★'.repeat(Math.max(0, Math.min(5, q))) + '☆'.repeat(Math.max(0, 5 - q))
}

export default function MapPage() {
  const mapRef        = useRef<any>(null)
  const markersRef    = useRef<any[]>([])
  const containerRef  = useRef<HTMLDivElement>(null)
  const [peaks, setPeaks]           = useState<Peak[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)

  // Load peaks from CSV
  useEffect(() => {
    loadPeaks().then(data => {
      setPeaks(data)
      setLoading(false)
    })
  }, [])

  // Init Leaflet map once
  useEffect(() => {
    if (loading || mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center:     [44, -112],
      zoom:       5,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 150)
    return () => { map.remove(); mapRef.current = null }
  }, [loading])

  // Update markers when filter changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || peaks.length === 0) return

    // Remove existing markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const minProm = PROMINENCE_FILTERS[activeFilter].min
    const filtered = peaks.filter(p => p.prominence >= minProm)
    setVisibleCount(filtered.length)

    filtered.forEach(peak => {
      if (!peak.lat || !peak.lng) return

      const isHighProm = peak.prominence >= 4000
      const isHighElev = peak.elev > 14000

      const dot = L.divIcon({
        className: '',
        html: `<div style="
          width: ${isHighProm ? '12px' : '8px'};
          height: ${isHighProm ? '12px' : '8px'};
          background: ${isHighElev ? PARCH : SIENNA};
          border: 2px solid rgba(237,228,208,${isHighProm ? '0.7' : '0.4'});
          border-radius: 50%;
          box-shadow: 0 0 ${isHighProm ? '8px' : '4px'} rgba(196,98,45,${isHighProm ? '0.6' : '0.3'});
          cursor: pointer;
          transition: transform 0.2s;
        "></div>`,
        iconSize:   [isHighProm ? 12 : 8, isHighProm ? 12 : 8],
        iconAnchor: [isHighProm ? 6  : 4, isHighProm ? 6  : 4],
      })

      const marker = L.marker([peak.lat, peak.lng], { icon: dot })

      const popupContent = `
        <div style="font-family:'Lora',Georgia,serif; min-width:200px;">
          <div style="font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:${SIENNA};margin-bottom:0.4rem;">
            ${peak.location}
          </div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:700;color:${PARCH};margin-bottom:0.8rem;line-height:1.2;">
            ${peak.name}
          </div>
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
            <div style="color:${SIENNA};font-size:0.75rem;letter-spacing:0.05em;">${qualityStars(peak.quality)}</div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth:  260,
        className: 'lnl-popup',
      })

      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [peaks, activeFilter])

  return (
    <div style={{ background: INK, height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>

      {/* Popup styles */}
      <style>{`
        .lnl-popup .leaflet-popup-content-wrapper {
          background: rgba(26,35,24,0.95) !important;
          border: 1px solid rgba(196,98,45,0.4) !important;
          border-radius: 3px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(12px);
        }
        .lnl-popup .leaflet-popup-tip {
          background: rgba(26,35,24,0.95) !important;
        }
        .lnl-popup .leaflet-popup-content {
          margin: 14px 16px !important;
        }
        .leaflet-container {
          background: #1a2318 !important;
        }
      `}</style>

      {/* Filter bar */}
      <div style={{
        background: 'rgba(26,35,24,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(196,98,45,0.25)',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        zIndex: 10,
        flexWrap: 'wrap',
      }}>
        {/* Label */}
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: STONE }}>
          Prominence
        </span>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PROMINENCE_FILTERS.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(i)}
              style={{
                fontFamily: "'Lora', serif",
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.9rem',
                border: `1px solid ${activeFilter === i ? SIENNA : 'rgba(139,115,85,0.4)'}`,
                background: activeFilter === i ? 'rgba(196,98,45,0.15)' : 'transparent',
                color: activeFilter === i ? PARCH : MUTED,
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: STONE, fontStyle: 'italic', marginLeft: 'auto' }}>
          {loading ? 'Loading...' : `${visibleCount} peaks`}
        </span>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PARCH, border: `2px solid rgba(237,228,208,0.7)` }} />
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE }}>14,000ft+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SIENNA, border: `2px solid rgba(237,228,208,0.4)` }} />
            <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', color: STONE }}>Other</span>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: INK,
          }}>
            <span style={{ fontFamily: "'Lora', serif", color: STONE, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Loading peaks...
            </span>
          </div>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

    </div>
  )
}
