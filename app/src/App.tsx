import { useState } from 'react'
import './App.css'

import { Overview } from './pages/Overview'
import { Journal } from './pages/Journal'
import { Adventures } from './pages/Adventures'
import { Projects } from './pages/Projects'
import { StatsMap } from './pages/StatsMap'
import { Gallery } from './pages/Gallery'

import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const navItems: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'journal', label: 'Journal', icon: Calendar },
    { id: 'adventures', label: 'Adventures', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Mountain },
    { id: 'stats-map', label: 'Stats+Map', icon: TrendingUp },
    { id: 'gallery', label: 'Gallery', icon: Camera },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-[var(--accent)]" />
              <h1 className="text-xl font-bold tracking-tight">NIVO JOURNAL</h1>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span>LifeNotLived</span>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px">
            {navItems.map((item) => (
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'journal' && <Journal />}
        {activeTab === 'adventures' && <Adventures />}
        {activeTab === 'projects' && <Projects />}
        {activeTab === 'stats-map' && <StatsMap />}
        {activeTab === 'gallery' && <Gallery onSelectImage={setSelectedImage} />}
      </main>

      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold">LifeNotLived</span>
            </div>
            <div className="text-center md:text-right">
              <p>© 2026 LifeNotLived. All rights reserved.</p>
              <p className="mt-1">Document often, explore more.</p>
            </div>
          </div>
        </div>
      </footer>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setSelectedImage(null)}
            type="button"
          >
            <span className="text-2xl">&times;</span>
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain border border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default App
