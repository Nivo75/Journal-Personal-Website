import { useState } from 'react'
import './App.css'
import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'
import { Overview } from './pages/Overview'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

type GalleryItem = { src: string; caption: string }

const sampleGallery: GalleryItem[] = [
  { src: '/placeholder-photo.svg', caption: 'Placeholder image' },
]

function EmptyPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="box">
      <div className="box-header">{title}</div>
      <div className="p-4 text-sm text-[var(--text-muted)]">{message}</div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-[var(--accent)]" />
              <h1 className="text-xl font-bold tracking-tight">NIVO JOURNAL</h1>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px">
            {[
              { id: 'overview' as const, label: 'Overview', icon: Compass },
              { id: 'journal' as const, label: 'Journal', icon: Calendar },
              { id: 'adventures' as const, label: 'Adventures', icon: BookOpen },
              { id: 'projects' as const, label: 'Projects', icon: Mountain },
              { id: 'stats-map' as const, label: 'Stats+Map', icon: TrendingUp },
              { id: 'gallery' as const, label: 'Gallery', icon: Camera },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link flex items-center gap-2 ${activeTab === item.id ? 'active' : ''}`}
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
        {activeTab === 'journal' && (
          <EmptyPage title="Journal" message="No entries yet — first journal updates coming soon." />
        )}
        {activeTab === 'adventures' && (
          <EmptyPage title="Adventures" message="No adventures yet — first entries coming soon." />
        )}
        {activeTab === 'projects' && (
          <EmptyPage title="Projects" message="No projects yet — first entries coming soon." />
        )}
        {activeTab === 'stats-map' && (
          <EmptyPage title="Stats+Map" message="Stats and map integrations are coming soon." />
        )}
        {activeTab === 'gallery' && (
          <div className="box">
            <div className="box-header">Gallery</div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {sampleGallery.map((img) => (
                <button key={img.src} className="thumb p-0" onClick={() => setSelectedImage(img.src)}>
                  <img src={img.src} alt={img.caption} className="w-full h-48 object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setSelectedImage(null)}
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
