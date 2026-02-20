import { useState, useMemo, useEffect } from 'react'
import { Search, X, Tag } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type JournalEntry = {
  id: string
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

type JournalProps = {
  // Props kept for backward compatibility but not used
}

export function Journal({}: JournalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)

  // Load entries from Supabase
  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error loading journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagSet.add(tag)
          }
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [entries])

  // Filter entries based on search and tag
  const filteredEntries = useMemo(() => {
    let filtered = entries

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.date.toLowerCase().includes(query)
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(entry => 
        entry.tags && Array.isArray(entry.tags) && entry.tags.includes(selectedTag)
      )
    }

    return filtered
  }, [entries, searchQuery, selectedTag])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTag(null)
  }

  const hasFilters = searchQuery.trim() || selectedTag

  const selectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Journal</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          Personal reflections, observations, and notes from the field.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="box md:col-span-1">
          <div className="box-header">Entries</div>
          <div className="p-3">
            <div className="mb-4">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" 
                />
                <input
                  type="text"
                  placeholder="Search titles or dates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Filter by tag
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        selectedTag === tag
                          ? 'bg-[var(--accent-2)] text-[var(--bg-primary)] border border-[var(--accent-2)]'
                          : 'bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent-2)]'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full mb-3 px-3 py-1.5 text-xs text-[var(--accent-2)] hover:text-[var(--accent)] border border-[var(--border)] rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}

            {loading ? (
              <div className="text-sm text-[var(--text-muted)] italic py-4">
                Loading entries...
              </div>
            ) : entries.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] italic py-4">
                No entries yet. First journal posts coming soon.
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] italic py-4 text-center">
                No entries match your search.
              </div>
            ) : (
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-2">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                  {hasFilters && ` found`}
                </div>
                <ul className="list-plain">
                  {filteredEntries.map((entry) => (
                    <li
                      key={entry.id}
                      className={`cursor-pointer transition-all ${
                        activeEntry?.id === entry.id
                          ? 'text-[var(--accent-2)]' 
                          : 'text-[var(--text-primary)]'
                      }`}
                      onClick={() => selectEntry(entry)}
                    >
                      <div className="text-sm font-medium hover:text-[var(--accent-2)]">
                        {entry.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--text-muted)]">{entry.date}</span>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-1">
                            {entry.tags.slice(0, 2).map(tag => (
                              <span 
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                                style={{ fontSize: '0.65rem' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="box md:col-span-2 entry-card journal">
          <div className="p-6">
            {activeEntry ? (
              <div>
                <pre className="whitespace-pre-wrap font-[var(--font-body)] text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {activeEntry.content}
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
