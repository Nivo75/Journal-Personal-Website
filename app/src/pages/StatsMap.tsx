import { type SiteStats } from './types'

type StatsMapProps = {
  stats: SiteStats
}

export function StatsMap({ stats }: StatsMapProps) {
  return (
    <div className="space-y-4">
      <div className="box">
        <div className="box-header">Stats Snapshot</div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="stat-number">{stats.peaksClimbed}</div>
              <div className="stat-label">Routes Completed</div>
            </div>
            <div>
              <div className="stat-number">{stats.totalElevation}</div>
              <div className="stat-label">Total Elevation</div>
            </div>
            <div>
              <div className="stat-number">{stats.tripReports}</div>
              <div className="stat-label">Trips Logged</div>
            </div>
            <div>
              <div className="stat-number">{stats.photos}</div>
              <div className="stat-label">Photos</div>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <div className="box-header">Map</div>
        <div className="p-4 text-sm text-[var(--text-muted)]">
          Map layer not connected yet — map data integration is coming soon.
        </div>
      </div>
    </div>
  )
}
