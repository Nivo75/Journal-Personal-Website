import { useEffect, useState } from 'react'
import { ExternalLink, TrendingUp, ArrowLeft, Globe, MapPin, TrendingUp as Elevation } from 'lucide-react'

type Continent = 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania'

type AdventureIndexItem = {
  slug: string
  title: string
  date: string
  continent: Continent
  location: string
  distance: string
  elevation_gain: string
  difficulty: string
  file: string
}

type AdventuresProps = {
  // Empty for now - adventures load from index.json
}

const continents: Continent[] = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania']

const getContinentSVG = (continent: Continent): string => {
  const svgs: Record<Continent, string> = {
    'North America': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 40,30 Q 60,25 80,30 L 90,35 Q 100,40 110,50 L 120,70 Q 125,90 120,110 L 110,130 Q 100,140 90,145 L 70,150 Q 50,148 40,140 L 30,120 Q 25,100 28,80 L 35,60 Q 38,45 40,30 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 50,50 Q 70,48 85,52" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><path d="M 48,65 Q 75,63 95,67" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="75" cy="70" r="2" fill="#8B7355"/></svg>`)}`,
    'South America': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 80,30 Q 90,28 95,35 L 100,50 Q 102,70 98,90 L 95,110 Q 93,130 88,145 L 82,160 Q 75,170 68,165 L 60,155 Q 55,140 58,120 L 62,100 Q 65,80 68,65 L 72,45 Q 75,32 80,30 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 75,45 Q 78,60 76,75" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="74" cy="65" r="2" fill="#8B7355"/></svg>`)}`,
    'Europe': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 60,50 Q 80,45 100,48 L 115,52 Q 125,58 130,68 L 135,85 Q 133,100 125,110 L 110,118 Q 90,120 75,115 L 60,108 Q 50,98 52,85 L 55,70 Q 58,58 60,50 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 75,75 Q 90,73 105,76" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="90" cy="80" r="2" fill="#8B7355"/></svg>`)}`,
    'Asia': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 30,40 Q 50,35 70,38 L 95,42 Q 120,48 140,58 L 155,75 Q 165,95 160,115 L 150,135 Q 135,148 115,152 L 90,155 Q 65,153 45,145 L 30,130 Q 22,110 25,90 L 28,70 Q 30,52 30,40 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 70,85 Q 95,82 115,87" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="95" cy="88" r="2" fill="#8B7355"/></svg>`)}`,
    'Africa': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 85,25 Q 95,23 102,28 L 108,40 Q 110,55 108,70 L 105,90 Q 102,110 98,125 L 92,145 Q 85,165 75,170 L 65,168 Q 58,160 56,145 L 55,125 Q 56,105 60,88 L 65,70 Q 70,50 78,35 Q 82,28 85,25 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 88,60 Q 90,80 89,100" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="87" cy="115" r="2" fill="#8B7355"/></svg>`)}`,
    'Oceania': `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#F5F2ED"/><path d="M 40,70 Q 65,65 90,70 L 110,78 Q 125,88 128,105 L 125,125 Q 115,138 95,142 L 70,140 Q 50,135 42,120 L 38,100 Q 38,82 40,70 Z" fill="none" stroke="#8B7355" stroke-width="1.5"/><path d="M 100,85 Q 105,100 103,115" fill="none" stroke="#A0634A" stroke-width="0.8" opacity="0.5"/><circle cx="102" cy="100" r="2" fill="#8B7355"/></svg>`)}`
  }
  return svgs[continent]
}

export function Adventures({}: AdventuresProps) {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null)
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null)
  const [adventureContent, setAdventureContent] = useState<string>('')
  const [adventureIndex, setAdventureIndex] = useState<AdventureIndexItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load adventure index
  useEffect(() => {
    fetch('/adventures/index.json')
      .then(res => res.json())
      .then(data => {
        setAdventureIndex(data.items || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load adventure index:', err)
        setLoading(false)
      })
  }, [])

  // Load adventure content when selected
  useEffect(() => {
    if (!selectedAdventure) {
      setAdventureContent('')
      return
    }

    const adventure = adventureIndex.find(a => a.slug === selectedAdventure)
    if (!adventure) return

    fetch(adventure.file)
      .then(res => res.text())
      .then(text => {
        // Strip frontmatter
        const content = text.replace(/^---[\s\S]*?---\n/, '')
        setAdventureContent(content)
      })
      .catch(err => {
        console.error('Failed to load adventure:', err)
        setAdventureContent('Failed to load adventure report.')
      })
  }, [selectedAdventure, adventureIndex])

  // Showing detail view
  if (selectedAdventure) {
    const adventure = adventureIndex.find(a => a.slug === selectedAdventure)
    
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setSelectedAdventure(null)}
            className="flex items-center gap-2 text-[var(--accent-2)] hover:text-[var(--accent)] mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to adventures
          </button>

          <h2 className="section-title">{adventure?.title}</h2>
          
          {adventure && (
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                {adventure.continent}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {adventure.location}
              </div>
              {adventure.distance && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {adventure.distance}
                </div>
              )}
              {adventure.elevation_gain && (
                <div className="flex items-center gap-1.5">
                  <Elevation className="w-4 h-4" />
                  {adventure.elevation_gain}
                </div>
              )}
              {adventure.difficulty && (
                <div>
                  <span className="tag">{adventure.difficulty}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="box entry-card adventure">
          <div className="p-6 md:p-8">
            <div 
              className="prose prose-classical"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: '1.7',
                color: 'var(--text-secondary)',
                maxWidth: 'none'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: adventureContent
                    .split('\n')
                    .map(line => {
                      if (line.startsWith('# ')) return `<h2 style="font-family: var(--font-header); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary);">${line.slice(2)}</h2>`
                      if (line.startsWith('## ')) return `<h3 style="font-family: var(--font-header); font-size: 1.4rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--text-primary);">${line.slice(3)}</h3>`
                      if (line.startsWith('- ')) return `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${line.slice(2)}</li>`
                      if (line.startsWith('**') && line.endsWith('**')) return `<p style="margin: 0.75rem 0;"><strong>${line.slice(2, -2)}</strong></p>`
                      if (line.trim() === '') return '<br/>'
                      return `<p style="margin: 0.75rem 0;">${line}</p>`
                    })
                    .join('')
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filter adventures by continent
  const filteredAdventures = selectedContinent
    ? adventureIndex.filter(a => a.continent === selectedContinent)
    : []

  // Count by continent
  const continentCounts = continents.map(continent => ({
    continent,
    count: adventureIndex.filter(a => a.continent === continent).length
  }))

  // Main continent selection view
  if (!selectedContinent) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="section-title">Adventures</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-4">
            Expeditions and field reports organized by continent. Select a region to view detailed trip accounts.
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-[var(--text-muted)] italic py-8 text-center">
            Loading adventures...
          </div>
        ) : (
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
        )}
      </div>
    )
  }

  // Continent detail view
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => setSelectedContinent(null)}
          className="flex items-center gap-2 text-[var(--accent-2)] hover:text-[var(--accent)] mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all continents
        </button>

        <h2 className="section-title">{selectedContinent}</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          {filteredAdventures.length} {filteredAdventures.length === 1 ? 'adventure' : 'adventures'} logged in this region.
        </p>
      </div>

      {filteredAdventures.length === 0 ? (
        <div className="box">
          <div className="p-6 text-sm text-[var(--text-muted)] italic text-center">
            No adventures yet in {selectedContinent}.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAdventures.map((adventure) => (
            <button
              key={adventure.slug}
              onClick={() => setSelectedAdventure(adventure.slug)}
              className="entry-card adventure w-full text-left"
              style={{ cursor: 'pointer' }}
            >
              <div className="entry-dot"></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <h3 className="text-lg font-[var(--font-header)] font-normal text-[var(--text-primary)]">
                    {adventure.title}
                  </h3>
                  <span className="tag whitespace-nowrap">{adventure.date}</span>
                </div>
                
                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)] mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {adventure.location}
                  </span>
                  {adventure.distance && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {adventure.distance}
                    </span>
                  )}
                  {adventure.elevation_gain && (
                    <span className="flex items-center gap-1">
                      <Elevation className="w-3 h-3" />
                      {adventure.elevation_gain}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent-2)] hover:text-[var(--accent)] text-sm flex items-center gap-1">
                    Read Full Report
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
