import { useMemo, useState } from 'react'
import './App.css'
import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'
import { Overview } from './pages/Overview'

type TabId = 'overview' | 'journal' | 'adventures' | 'projects' | 'stats-map' | 'gallery'

type GalleryItem = {
  src: string
  caption: string
}

function EmptyPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="box">
      <div className="box-header">{title}</div>
      <div className="p-4">
        <p className="text-[var(--text-secondary)] text-sm">{message}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const sampleGallery = useMemo<GalleryItem[]>(
    () => [
      { src: '/placeholder-photo.svg', caption: 'Placeholder image' },
      { src: '/placeholder-photo.svg', caption: 'Placeholder image' },
      { src: '/placeholder-photo.svg', caption: 'Placeholder image' },
    ],
    []
  )

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
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-[var(--accent)]" />
              <h1 className="text-xl font-bold tracking-tight">LifeNotLived</h1>
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <Overview />}

        {activeTab === 'journal' && (
          <EmptyPage title="Journal" message="Placeholder: entries will appear here once wired up." />
        )}

        {activeTab === 'adventures' && (
          <EmptyPage title="Adventures" message="Placeholder: Continent → Country → Trips." />
        )}

        {activeTab === 'projects' && (
          <EmptyPage title="Projects" message="Placeholder: projects list will go here." />
        )}

        {activeTab === 'stats-map' && (
          <EmptyPage
            title="Stats + Map"
            message="Placeholder: stats snapshot + interactive map pins (MVP: pins first)."
          />
        )}

        {activeTab === 'gallery' && (
          <div className="box">
            <div className="box-header">Gallery</div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sampleGallery.map((img, i) => (
                  <button
                    key={`${img.src}-${i}`}
                    className="thumb cursor-pointer"
                    type="button"
                    onClick={() => setSelectedImage(img.src)}
                  >
                    <img src={img.src} alt={img.caption} className="w-full h-40 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold">LifeNotLived</span>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} LifeNotLived</p>
              <p className="mt-1">You are what you do.</p>
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
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelectedImage(null)}
            type="button"
          >
            <span className="text-2xl">&times;</span>
          </button>

          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain border border-white/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
