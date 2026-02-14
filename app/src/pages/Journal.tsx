import { type JournalIndexItem } from './types'

type JournalProps = {
  journalIndex: JournalIndexItem[]
  activeJournalSlug: string | null
  activeJournalText: string
  onSelectJournal: (slug: string) => void
}

export function Journal({ journalIndex, activeJournalSlug, activeJournalText, onSelectJournal }: JournalProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="box md:col-span-1">
        <div className="box-header">Journal Entries</div>
        <div className="p-3">
          {journalIndex.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)]">
              No entries yet. Add one from <span className="font-mono">/admin</span>.
            </div>
          ) : (
            <ul className="list-plain">
              {journalIndex.map((entry) => (
                <li
                  key={entry.slug}
                  className={`py-2 cursor-pointer ${activeJournalSlug === entry.slug ? 'text-[var(--link)]' : 'text-[var(--text-primary)]'}`}
                  onClick={() => onSelectJournal(entry.slug)}
                >
                  <div className="text-sm font-medium hover:underline">{entry.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{entry.date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="box md:col-span-2">
        <div className="box-header">Entry</div>
        <div className="p-4">
          {activeJournalText ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{activeJournalText}</pre>
          ) : (
            <div className="text-sm text-[var(--text-muted)]">Select an entry to read.</div>
          )}
        </div>
      </div>
    </div>
  )
}
