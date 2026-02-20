import { useState, useMemo } from 'react'
import './App.css'
import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'
import { Overview } from './pages/Overview'
import { Journal } from './pages/Journal'
import { Adventures } from './pages/Adventures'
import { Projects } from './pages/Projects'
import { StatsMap } from './pages/StatsMap'
import { Gallery } from './pages/Gallery'
import { ThemeToggle } from './components/ThemeToggle'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--header-bg)', borderBottom: '1px solid var(--border)' }}>
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
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            {nav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  activeTab === id
                    ? 'text-[var(--accent-2)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{
                  fontFamily: 'var(--font-body)',
                  paddingBottom: '0.75rem',
                  borderBottom: activeTab === id ? '2px solid var(--accent-2)' : '2px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'journal' && <Journal />}
        {activeTab === 'adventures' && <Adventures />}
        {activeTab === 'projects' && <Projects />}
        {activeTab === 'stats-map' && <StatsMap />}
        {activeTab === 'gallery' && <Gallery onSelectImage={setSelectedImage} />}
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="footer" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} LifeNotLived. All records maintained in the field.
          </p>
        </div>
      </footer>
    </div>
  )
}
