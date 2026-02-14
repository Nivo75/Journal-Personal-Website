import { ExternalLink, TrendingUp, User } from 'lucide-react'
import { type TripReport } from './types'

type AdventuresProps = {
  tripReports: TripReport[]
}

export function Adventures({ tripReports }: AdventuresProps) {
  return (
    <div className="space-y-4">
      <div className="box">
        <div className="box-header">Adventures</div>
        <div className="p-4">
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Detailed accounts of selected trips including route conditions, gear used, and lessons learned.
          </p>
        </div>
      </div>
      {tripReports.length === 0 ? (
        <div className="box">
          <div className="p-4 text-sm text-[var(--text-muted)]">No adventures yet — first entries coming soon.</div>
        </div>
      ) : (
        tripReports.map((report, i) => (
          <div key={i} className="box">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-[var(--link)] cursor-pointer hover:underline">
                  {report.title}
                </h3>
                <span className="tag">{report.date}</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm mb-3">
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
                <button className="text-[var(--link)] hover:underline flex items-center gap-1 ml-auto">
                  Read Entry
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
