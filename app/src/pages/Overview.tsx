import { useEffect, useState } from 'react'
import { type JournalIndexItem, type TripReport, type Project } from './types'

type LatestEntry = {
  type: 'Journal' | 'Adventure' | 'Project'
  title: string
  description: string
  date?: string
}

export function Overview() {
  const [latestEntries, setLatestEntries] = useState<LatestEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLatestEntries = async () => {
      const entries: LatestEntry[] = []

      try {
        // Load latest journal entry
        const journalRes = await fetch('/journal/index.json')
        const journalData = await journalRes.json()
        const latestJournal = journalData.items?.[0] as JournalIndexItem | undefined
        if (latestJournal) {
          entries.push({
            type: 'Journal',
            title: latestJournal.title,
            description: `Posted ${latestJournal.date}`,
            date: latestJournal.date
          })
        }
      } catch (err) {
        console.error('Failed to load journal:', err)
      }

      try {
        // Load latest adventure
        const adventuresRes = await fetch('/content/tripReports.json')
        const adventuresData = await adventuresRes.json()
        const latestAdventure = adventuresData.items?.[0] as TripReport | undefined
        if (latestAdventure) {
          entries.push({
            type: 'Adventure',
            title: latestAdventure.title,
            description: `${latestAdventure.continent} • ${latestAdventure.date}`,
            date: latestAdventure.date
          })
        }
      } catch (err) {
        console.error('Failed to load adventures:', err)
      }

      try {
        // Load latest project
        const projectsRes = await fetch('/content/projects.json')
        const projectsData = await projectsRes.json()
        const latestProject = projectsData.items?.[0] as Project | undefined
        if (latestProject) {
          entries.push({
            type: 'Project',
            title: latestProject.title,
            description: `${latestProject.category} • ${latestProject.status}`,
            date: latestProject.date
          })
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
      }

      // If no entries loaded, show placeholders
      if (entries.length === 0) {
        entries.push(
          { type: 'Journal', title: 'First entry coming soon', description: 'Notes and updates will appear here.' },
          { type: 'Adventure', title: 'Adventure log placeholder', description: 'Upcoming outings will be tracked here.' },
          { type: 'Project', title: 'Project update placeholder', description: 'Active builds and progress notes coming soon.' }
        )
      }

      setLatestEntries(entries)
      setLoading(false)
    }

    loadLatestEntries()
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="box hero-box">
        <div className="hero-decoration"></div>
        <div className="p-8">
          <div className="hero-label">Navion Man</div>
          <p className="hero-text">You are what you do</p>
        </div>
      </div>

      {/* What I've Been Up To */}
      <div>
        <h2 className="section-title">What I've Been Up To</h2>
        <div className="box update-box">
          <div className="p-7 text-[var(--text-secondary)] text-[15px] leading-relaxed">
            I'm rebuilding this personal site into a cleaner v2 experience focused on journals, adventures, and
            projects. Fresh entries, media, and map-backed milestones will be published here soon.
          </div>
        </div>
      </div>

      {/* Latest Entries - Auto-loaded */}
      <div>
        <h2 className="section-title block">Latest Entries</h2>
        {loading ? (
          <div className="text-sm text-[var(--text-muted)] italic py-4 text-center">
            Loading latest entries...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestEntries.map((entry, idx) => (
              <article 
                key={idx} 
                className={`entry-card ${entry.type.toLowerCase()}`}
              >
                <div className="entry-dot"></div>
                <div className="entry-type">{entry.type}</div>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="section-title block">Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {['Elevation', 'Prominence', 'Major List', 'Minor List'].map((label) => (
            <div key={label} className="stat-card">
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
