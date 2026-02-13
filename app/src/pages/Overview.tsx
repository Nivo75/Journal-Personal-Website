import { type GalleryImage, type Peak, type SiteStats, type TripReport } from './types'

type OverviewProps = {
  stats: SiteStats
  peaks: Peak[]
  tripReports: TripReport[]
  galleryImages: GalleryImage[]
  onOpenProjects: () => void
  onOpenAdventures: () => void
  onOpenGallery: () => void
  onSelectImage: (src: string) => void
}

export function Overview({
  stats,
  peaks,
  tripReports,
  galleryImages,
  onOpenProjects,
  onOpenAdventures,
  onOpenGallery,
  onSelectImage,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="box">
        <div className="box-header">Hero</div>
        <div className="p-4">
          <video
            src="/media/hero.mp4"
            controls
            playsInline
            className="w-full rounded border border-[var(--border)] bg-black"
          >
            Your browser does not support the hero video.
          </video>
          <p className="text-xs text-[var(--text-muted)] mt-2">Overview hero media: /media/hero.mp4</p>
        </div>
      </div>

      <div className="box">
        <div className="box-header">Welcome to My Personal Site</div>
        <div className="p-4">
          <p className="text-[var(--text-secondary)] mb-4">
            This is a home for my notes, adventures, and projects in the Pacific Northwest and beyond.
            I use it to keep a running record of experiences, route details, and ideas over time.
          </p>
          <p className="text-[var(--text-secondary)]">
            Use the navigation above to explore journal entries, trip write-ups, project logs,
            and photos from the trail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="box text-center p-4">
          <div className="stat-number">{stats.peaksClimbed}</div>
          <div className="stat-label">Routes Completed</div>
        </div>
        <div className="box text-center p-4">
          <div className="stat-number">{stats.totalElevation}</div>
          <div className="stat-label">Total Elevation</div>
        </div>
        <div className="box text-center p-4">
          <div className="stat-number">{stats.tripReports}</div>
          <div className="stat-label">Adventures</div>
        </div>
        <div className="box text-center p-4">
          <div className="stat-number">{stats.photos}</div>
          <div className="stat-label">Photos</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="box">
          <div className="box-header flex items-center justify-between">
            <span>Recent Projects</span>
            <button onClick={onOpenProjects} className="text-[var(--link)] text-xs hover:underline">
              View All
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Region</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {peaks.slice(0, 5).map((peak, i) => (
                <tr key={i} className="cursor-pointer">
                  <td className="text-[var(--link)]">{peak.name}</td>
                  <td>{peak.elevation}</td>
                  <td>{peak.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="box">
          <div className="box-header flex items-center justify-between">
            <span>Recent Adventures</span>
            <button onClick={onOpenAdventures} className="text-[var(--link)] text-xs hover:underline">
              View All
            </button>
          </div>
          <ul className="list-plain">
            {tripReports.length === 0 ? (
              <li className="p-4 text-sm text-[var(--text-muted)]">No adventures yet — first entries coming soon.</li>
            ) : (
              tripReports.map((report, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[var(--link)] text-sm">{report.title}</div>
                    <div className="text-[var(--text-muted)] text-xs">{report.date}</div>
                  </div>
                  <div className="text-right text-xs text-[var(--text-muted)]">
                    <div>{report.views} views</div>
                    <div>{report.comments} comments</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="box-header flex items-center justify-between">
          <span>Latest Photos</span>
          <button onClick={onOpenGallery} className="text-[var(--link)] text-xs hover:underline">
            View Gallery
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="thumb cursor-pointer" onClick={() => onSelectImage(img.src)}>
                <img src={img.src} alt={img.caption} className="w-full h-20 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
