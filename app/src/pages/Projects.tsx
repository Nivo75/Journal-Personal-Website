import { type Peak } from './types'

type ProjectsProps = {
  peaks: Peak[]
}

export function Projects({ peaks }: ProjectsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title">Projects</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          A running list of ongoing and completed field projects, sorted by date.
          Select any entry to review notes, location details, and related trip context.
        </p>
      </div>

      {/* Projects Content */}
      <div className="box entry-card project">
        <div className="entry-dot"></div>
        <div className="p-6">
          {peaks.length === 0 ? (
            <div className="py-8 text-sm text-[var(--text-muted)] italic text-center">
              No projects yet — first entries coming soon.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project</th>
                    <th>Distance / Gain</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {peaks.map((peak, i) => (
                    <tr key={i}>
                      <td className="text-[var(--text-muted)]">{i + 1}</td>
                      <td className="font-medium">
                        <span className="text-[var(--accent-2)] cursor-pointer hover:text-[var(--accent)] hover:underline transition-colors">
                          {peak.name}
                        </span>
                      </td>
                      <td className="text-[var(--text-secondary)]">{peak.elevation}</td>
                      <td className="text-[var(--text-secondary)]">{peak.location}</td>
                      <td>
                        <span className="tag">{peak.type}</span>
                      </td>
                      <td className="text-[var(--text-muted)]">{peak.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
