import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'
import { Overview } from './pages/Overview'
import { Journal } from './pages/Journal'
import { Adventures } from './pages/Adventures'
import { Projects } from './pages/Projects'
import { StatsMap } from './pages/StatsMap'
import { Gallery } from './pages/Gallery'
import { type Project, type TripReport, type GalleryImage, type JournalIndexItem } from './pages/types'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // Journal state
  const [journalIndex, setJournalIndex] = useState<JournalIndexItem[]>([])
  const [activeJournalSlug, setActiveJournalSlug] = useState<string | null>(null)
  const [activeJournalText, setActiveJournalText] = useState<string>('')
  
  // Content state
  const [tripReports, setTripReports] = useState<TripReport[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])

  // Load all content on mount
  useEffect(() => {
    // Load journal index
    fetch('/journal/index.json')
      .then(res => res.json())
      .then(data => setJournalIndex(data.items || []))
      .catch(err => console.error('Failed to load journal index:', err))

    // Load trip reports
    fetch('/content/tripReports.json')
      .then(res => res.json())
      .then(data => setTripReports(data.items || []))
      .catch(err => console.error('Failed to load trip reports:', err))

    // Load projects
    fetch('/content/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data.items || []))
      .catch(err => console.error('Failed to load projects:', err))

    // Load gallery
    fetch('/content/gallery.json')
      .then(res => res.json())
      .then(data => setGalleryImages(data.items || []))
      .catch(err => console.error('Failed to load gallery:', err))
  }, [])

  // Load journal entry when selected
  useEffect(() => {
    if (!activeJournalSlug) {
      setActiveJournalText('')
      return
    }
    
    const entry = journalIndex.find(e => e.slug === activeJournalSlug)
    if (!entry) return

    fetch(entry.file)
      .then(res => res.text())
      .then(text => {
        // Strip frontmatter for display
        const content = text.replace(/^---[\s\S]*?---\n/, '')
        setActiveJournalText(content)
      })
      .catch(err => {
        console.error('Failed to load journal entry:', err)
        setActiveJournalText('Failed to load entry.')
      })
  }, [activeJournalSlug, journalIndex])

  const nav = useMemo(
    () => [
      { id: 'overview' as const, label: 'Overview', icon: Compass },
      { id: 'journal' as const, label: 'Journal', icon: Calendar },
      { id: 'adventures' as const, label: 'Adventures', icon: BookOpen },
      { id: 'projects' as const, label: 'Projects', icon: Mountain },
      { id: 'stats-map' as const, label: 'Stats+Map', icon: TrendingUp },
      { id: 'gallery' as const, label: 'Gallery', icon: Camera },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-[var(--accent-2)]" />
              <div style={{ position: 'relative' }}>
                <h1 className="text-2xl tracking-wide" style={{ fontFamily: 'var(--font-header)', fontWeight: 400 }}>
                  LifeNotLived
                </h1>
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: 0,
                  width: '60%',
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--accent-3), transparent)',
                  opacity: 0.6
                }} />
              </div>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px flex-wrap">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link flex items-center gap-2 ${activeTab === item.id ? 'active' : ''}`}
                type="button"
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <Overview />}

        {activeTab === 'journal' && (
          <Journal
            journalIndex={journalIndex}
            activeJournalSlug={activeJournalSlug}
            activeJournalText={activeJournalText}
            onSelectJournal={(slug: string) => setActiveJournalSlug(slug)}
          />
        )}

        {activeTab === 'adventures' && (
          <Adventures tripReports={tripReports} />
        )}

        {activeTab === 'projects' && (
          <Projects projects={projects} />
        )}

        {activeTab === 'stats-map' && <StatsMap />}

        {activeTab === 'gallery' && (
          <Gallery
            galleryImages={galleryImages}
            onSelectImage={(src: string) => setSelectedImage(src)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[var(--accent)]" />
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--accent)' }}>LifeNotLived</span>
            </div>
            <div className="text-center md:text-right">
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>You are what you do.</p>
              <p className="mt-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                © {new Date().getFullYear()} LifeNotLived
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4"
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.5rem' }}
            onClick={() => setSelectedImage(null)}
            type="button"
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
