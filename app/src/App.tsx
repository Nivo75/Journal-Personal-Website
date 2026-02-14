import { useState } from 'react'
import './App.css'
import { Compass, Calendar, BookOpen, Mountain, TrendingUp, Camera } from 'lucide-react'

import { Overview } from './pages/Overview'
import { Journal } from './pages/Journal'
import { Adventures } from './pages/Adventures'
import { Projects } from './pages/Projects'
import { StatsMap } from './pages/StatsMap'
import { Gallery } from './pages/Gallery'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

const NAV: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'overview', label: 'Overview', icon: Compass },
  { id: 'journal', label: 'Journal', icon: Calendar },
  { id: 'adventures', label: 'Adventures', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: Mountain },
  { id: 'stats-map', label: 'Stats+Map', icon: TrendingUp },
  { id: 'gallery', label: 'Gallery', icon: Camera },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-[var(--accent)]" />
              <h1 className="text-xl font-bold tracking-tight">LifeNotLived</h1>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px">
            {NAV.map((item) => (
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
        {activeTab === 'gallery' && <Gallery />}
      </main>

      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold">LifeNotLived</span>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} LifeNotLived. All rights reserved.</p>
              <p className="mt-1">Document often, explore more.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
