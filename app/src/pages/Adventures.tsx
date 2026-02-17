import { ExternalLink, TrendingUp, User } from 'lucide-react'
import { type TripReport } from './types'

type AdventuresProps = {
  tripReports: TripReport[]
}

export function Adventures({ tripReports }: AdventuresProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title">Adventures</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          Detailed accounts of selected trips including route conditions, gear used, and lessons learned.
        </p>
      </div>

      {/* Adventure Cards */}
      {tripReports.length === 0 ? (
        <div className="box">
          <div className="p-6 text-sm text-[var(--text-muted)] italic text-center">
            No adventures yet — first entries coming soon.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tripReports.map((report, i) => (
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
