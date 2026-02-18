import { type JournalIndexItem } from './types'

type JournalProps = {
  journalIndex: JournalIndexItem[]
  activeJournalSlug: string | null
  activeJournalText: string
  onSelectJournal: (slug: string) => void
}

export function Journal({ journalIndex, activeJournalSlug, activeJournalText, onSelectJournal }: JournalProps) {
  return (
    <div className="space-y-6">
      {/* Header with Classical styling */}
      <div>
        <h2 className="section-title">Journal</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          Personal reflections, observations, and notes from the field.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Entries List */}
        <div className="box md:col-span-1">
          <div className="box-header">Entries</div>
          <div className="p-3">
            {journalIndex.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] italic py-4">
                No entries yet. First journal posts coming soon.
              </div>
            ) : (
              <ul className="list-plain">
                {journalIndex.map((entry) => (
                  <li
                    key={entry.slug}
                    className={`cursor-pointer transition-all ${
                      activeJournalSlug === entry.slug 
                        ? 'text-[var(--accent-2)]' 
                        : 'text-[var(--text-primary)]'
                    }`}
                    onClick={() => onSelectJournal(entry.slug)}
                  >
                    <div className="text-sm font-medium hover:text-[var(--accent-2)]">
                      {entry.title}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{entry.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Entry Content */}
        <div className="box md:col-span-2 entry-card journal">
          <div className="p-6">
            {activeJournalText ? (
              <div>
                <pre className="whitespace-pre-wrap font-[var(--font-body)] text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {activeJournalText}
                </pre>
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)] italic text-center py-12">
                Select an entry to read.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
