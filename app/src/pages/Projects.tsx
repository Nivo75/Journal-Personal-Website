import { type Peak } from './types'

type ProjectsProps = {
  peaks: Peak[]
}

export function Projects({ peaks }: ProjectsProps) {
  return (
    <div className="box">
      <div className="box-header">Projects</div>
      <div className="p-4">
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          A running list of ongoing and completed field projects, sorted by date.
          Select any entry to review notes, location details, and related trip context.
        </p>
        {peaks.length === 0 ? (
          <div className="p-4 text-sm text-[var(--text-muted)]">No projects yet — first entries coming soon.</div>
        ) : (
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
                  <td className="text-[var(--link)] cursor-pointer hover:underline">{peak.name}</td>
                  <td>{peak.elevation}</td>
                  <td>{peak.location}</td>
                  <td><span className="tag">{peak.type}</span></td>
                  <td>{peak.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
