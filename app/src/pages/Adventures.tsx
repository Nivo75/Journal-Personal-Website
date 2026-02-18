import { useState } from 'react'
import { ExternalLink, TrendingUp, User, ArrowLeft, Globe } from 'lucide-react'
import { type TripReport } from './types'

type AdventuresProps = {
  tripReports: TripReport[]
}

type Continent = 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania'

const continents: Continent[] = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania']

// Inline SVG maps as data URIs
const getContinentSVG = (continent: Continent): string => {
  const svgs: Record<Continent, string> = {
    'North America': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 40,30 Q 60,25 80,30 L 90,35 Q 100,40 110,50 L 120,70 Q 125,90 120,110 L 110,130 Q 100,140 90,145 L 70,150 Q 50,148 40,140 L 30,120 Q 25,100 28,80 L 35,60 Q 38,45 40,30 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 50,50 Q 70,48 85,52" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><path d="M 48,65 Q 75,63 95,67" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><path d="M 52,80 Q 70,78 88,82" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="75" cy="70" r="2" fill="#8B7355"/><circle cx="85" cy="90" r="2" fill="#8B7355"/></svg>`)}`,
    'South America': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 80,30 Q 90,28 95,35 L 100,50 Q 102,70 98,90 L 95,110 Q 93,130 88,145 L 82,160 Q 75,170 68,165 L 60,155 Q 55,140 58,120 L 62,100 Q 65,80 68,65 L 72,45 Q 75,32 80,30 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 75,45 Q 78,60 76,75" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><path d="M 73,90 Q 71,105 69,120" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="74" cy="65" r="2" fill="#8B7355"/></svg>`)}`,
    'Europe': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 60,50 Q 80,45 100,48 L 115,52 Q 125,58 130,68 L 135,85 Q 133,100 125,110 L 110,118 Q 90,120 75,115 L 60,108 Q 50,98 52,85 L 55,70 Q 58,58 60,50 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 75,75 Q 90,73 105,76" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="90" cy="80" r="2" fill="#8B7355"/></svg>`)}`,
    'Asia': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 30,40 Q 50,35 70,38 L 95,42 Q 120,48 140,58 L 155,75 Q 165,95 160,115 L 150,135 Q 135,148 115,152 L 90,155 Q 65,153 45,145 L 30,130 Q 22,110 25,90 L 28,70 Q 30,52 30,40 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 70,85 Q 95,82 115,87" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="95" cy="88" r="2" fill="#8B7355"/></svg>`)}`,
    'Africa': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 85,25 Q 95,23 102,28 L 108,40 Q 110,55 108,70 L 105,90 Q 102,110 98,125 L 92,145 Q 85,165 75,170 L 65,168 Q 58,160 56,145 L 55,125 Q 56,105 60,88 L 65,70 Q 70,50 78,35 Q 82,28 85,25 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 88,60 Q 90,80 89,100" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="87" cy="115" r="2" fill="#8B7355"/></svg>`)}`,
    'Oceania': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 40,70 Q 65,65 90,70 L 110,78 Q 125,88 128,105 L 125,125 Q 115,138 95,142 L 70,140 Q 50,135 42,120 L 38,100 Q 38,82 40,70 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 100,85 Q 105,100 103,115" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><ellipse cx="145" cy="125" rx="8" ry="18" fill="none" stroke="#8B7355" stroke-width="1.2"/><circle cx="102" cy="100" r="2" fill="#8B7355"/></svg>`)}`
  }
  return svgs[continent]
}

export function Adventures({ tripReports }: AdventuresProps) {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null)

  // Filter trips by continent
  const filteredTrips = selectedContinent
    ? tripReports.filter(trip => trip.continent === selectedContinent)
    : []

  // Count trips per continent
  const continentCounts = continents.map(continent => ({
    continent,
    count: tripReports.filter(trip => trip.continent === continent).length
  }))

  // Main continent selection view
  if (!selectedContinent) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="section-title">Adventures</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-4">
            Expeditions and field reports organized by continent. Select a region to view detailed trip accounts.
          </p>
        </div>

        {/* Continent Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {continentCounts.map(({ continent, count }) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className="entry-card adventure group"
              style={{ 
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div className="entry-dot"></div>
              
              {/* Map Image */}
              <div 
                style={{
                  width: '100%',
                  height: '140px',
                  marginBottom: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src={getContinentSVG(continent)} 
                  alt={continent}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Continent Name */}
              <h3 
                style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                {continent}
              </h3>

              {/* Trip Count */}
              <div 
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Globe className="w-4 h-4" />
                <span>{count} {count === 1 ? 'trip' : 'trips'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Continent detail view with trip listings
  return (
    <div className="space-y-6">
      {/* Back Button + Header */}
      <div>
        <button
          onClick={() => setSelectedContinent(null)}
          className="flex items-center gap-2 text-[var(--accent-2)] hover:text-[var(--accent)] mb-4 text-sm"
          style={{ cursor: 'pointer' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all continents
        </button>

        <h2 className="section-title">{selectedContinent}</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          {filteredTrips.length} {filteredTrips.length === 1 ? 'adventure' : 'adventures'} logged in this region.
        </p>
      </div>

      {/* Trip Cards */}
      {filteredTrips.length === 0 ? (
        <div className="box">
          <div className="p-6 text-sm text-[var(--text-muted)] italic text-center">
            No adventures yet in {selectedContinent}.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((report, i) => (
            <div key={i} className="entry-card adventure">
              <div className="entry-dot"></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <h3 className="text-lg font-[var(--font-header)] font-normal text-[var(--text-primary)]">
                    {report.title}
                  </h3>
                  <span className="tag whitespace-nowrap">{report.date}</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                  Trip report detailing the route, conditions, and key decision points from the outing.
                  Includes photos and GPS track where available.
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {report.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {report.comments} comments
                  </span>
                  <button className="text-[var(--accent-2)] hover:text-[var(--accent)] hover:underline flex items-center gap-1 ml-auto transition-colors">
                    Read Entry
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
