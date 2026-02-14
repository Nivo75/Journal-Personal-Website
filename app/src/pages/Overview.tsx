import { useRef, useState } from 'react'

const latestEntries = [
  { type: 'Journal', title: 'First entry coming soon', description: 'Notes and updates will appear here.' },
  { type: 'Adventure', title: 'Adventure log placeholder', description: 'Upcoming outings will be tracked here.' },
  { type: 'Project', title: 'Project update placeholder', description: 'Active builds and progress notes coming soon.' },
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
      <div className="box">
        <div className="box-header flex items-center justify-between">
          <span>Hero Video</span>
          <button onClick={togglePlayback} className="text-[var(--link)] text-xs hover:underline">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
        <div className="p-4 space-y-3">
          <video
            ref={videoRef}
            src="/media/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full rounded border border-[var(--border)] bg-black"
          >
            Your browser does not support the hero video.
          </video>
          {videoFailed && (
            <div className="text-sm text-[var(--text-muted)]">
              Hero video is unavailable. Add <span className="font-mono">/media/hero.mp4</span> to enable it.
            </div>
          )}
        </div>
      </div>

      <div className="box">
        <div className="box-header">Navion Man</div>
        <div className="p-4">
          <p className="text-[var(--text-secondary)]">You are what you do</p>
        </div>
      </div>

      <div className="box">
        <div className="box-header">What I&apos;ve Been Up To</div>
        <div className="p-4 text-[var(--text-secondary)] text-sm">
          I&apos;m rebuilding this personal site into a cleaner v2 experience focused on journals, adventures, and
          projects. Fresh entries, media, and map-backed milestones will be published here soon.
        </div>
      </div>

      <div className="box">
        <div className="box-header">Latest Entries</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestEntries.map((entry) => (
            <article key={entry.type} className="border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3">
              <div className="text-xs uppercase text-[var(--text-muted)]">{entry.type}</div>
              <h3 className="mt-1 font-semibold text-sm">{entry.title}</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{entry.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="box">
        <div className="box-header">Stats</div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {['Elevation', 'Prominence', 'Major_List', 'Minor_List'].map((label) => (
            <div key={label} className="border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2">
              <div className="text-xs text-[var(--text-muted)] uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
