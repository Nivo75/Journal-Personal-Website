import { useRef, useState } from 'react'

const latestEntries = [
  { type: 'journal', title: 'First entry coming soon', description: 'Notes and updates will appear here.' },
  { type: 'adventure', title: 'Adventure log placeholder', description: 'Upcoming outings will be tracked here.' },
  { type: 'project', title: 'Project update placeholder', description: 'Active builds and progress notes coming soon.' },
]

export function Overview() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        setVideoFailed(true)
      }
      return
    }

    video.pause()
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Classical Styling */}
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

      {/* Latest Entries with Color-Coded Cards */}
      <div>
        <h2 className="section-title block">Latest Entries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestEntries.map((entry) => (
            <article key={entry.type} className={`entry-card ${entry.type}`}>
              <div className="entry-dot"></div>
              <div className="entry-type">{entry.type}</div>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
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
