import { type SiteStats } from './types'

type StatsMapProps = {
  stats: SiteStats
}

export function StatsMap({ stats }: StatsMapProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title">Stats & Map</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          Overview of accumulated statistics and geographic distribution of completed routes.
        </p>
      </div>

      {/* Stats Snapshot */}
      <div className="box entry-card journal">
        <div className="entry-dot"></div>
        <div className="box-header">Stats Snapshot</div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="stat-number">{stats.peaksClimbed}</div>
              <div className="stat-label">Routes Completed</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.totalElevation}</div>
              <div className="stat-label">Total Elevation</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.tripReports}</div>
              <div className="stat-label">Trips Logged</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.photos}</div>
              <div className="stat-label">Photos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="box update-box">
        <div className="box-header">Interactive Map</div>
        <div className="p-6">
          <div className="text-sm text-[var(--text-muted)] italic text-center py-12 border-2 border-dashed border-[var(--border)] rounded">
            Map layer not connected yet — map data integration is coming soon.
            <br />
            <span className="text-xs mt-2 block">Will display pins for all logged routes and trip locations.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
