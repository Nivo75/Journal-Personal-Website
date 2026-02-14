import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Camera, Calendar, Compass, Mountain, TrendingUp, BookOpen } from 'lucide-react'
import { Overview } from './pages/Overview'
import { Journal } from './pages/Journal'
import { Adventures } from './pages/Adventures'
import { Projects } from './pages/Projects'
import { StatsMap } from './pages/StatsMap'
import { Gallery } from './pages/Gallery'
import { type GalleryImage, type JournalIndexItem, type Peak, type SiteStats, type TripReport } from './pages/types'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const defaultData = useMemo(() => {
    const peaks: Peak[] = [
      { name: 'Mount Rainier', elevation: '14,411 ft', location: 'Washington', date: '2023-07-15', type: 'Volcano' },
      { name: 'Mount Hood', elevation: '11,249 ft', location: 'Oregon', date: '2023-06-22', type: 'Volcano' },
      { name: 'Mount Adams', elevation: '12,281 ft', location: 'Washington', date: '2022-08-30', type: 'Volcano' },
      { name: 'Mount St. Helens', elevation: '8,363 ft', location: 'Washington', date: '2022-05-14', type: 'Volcano' },
      { name: 'Mount Shasta', elevation: '14,179 ft', location: 'California', date: '2021-09-03', type: 'Volcano' },
    ]

    const tripReports: TripReport[] = [
      { title: 'Winter Ascent of Mount Hood', date: 'Dec 12, 2023', views: 1247, comments: 23 },
      { title: 'Solo Traverse of the Cascades', date: 'Nov 28, 2023', views: 892, comments: 15 },
      { title: 'Rainier Disappointment Cleaver Route', date: 'Oct 15, 2023', views: 2156, comments: 41 },
      { title: 'Backpacking the Wonderland Trail', date: 'Sep 02, 2023', views: 1567, comments: 28 },
    ]

    const galleryImages: GalleryImage[] = [
      { src: '/gallery-1.jpg', caption: 'Summit view, Mount Rainier', date: 'Jul 2023' },
      { src: '/gallery-2.jpg', caption: 'Early morning start', date: 'Jun 2023' },
      { src: '/gallery-3.jpg', caption: 'Traversing the glacier', date: 'Aug 2022' },
      { src: '/gallery-4.jpg', caption: 'Camp at 10,000 ft', date: 'Sep 2022' },
      { src: '/gallery-5.jpg', caption: 'Route finding', date: 'May 2022' },
      { src: '/gallery-6.jpg', caption: 'Descent at dusk', date: 'Jul 2021' },
    ]

    const stats: SiteStats = {
      peaksClimbed: 47,
      totalElevation: '312,450 ft',
      tripReports: 23,
      photos: 847,
      memberSince: '2018',
      homeBase: 'Portland, OR',
    }

    return { peaks, tripReports, galleryImages, stats }
  }, [])

  const [peaks, setPeaks] = useState<Peak[]>(defaultData.peaks)
  const [tripReports, setTripReports] = useState<TripReport[]>(defaultData.tripReports)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultData.galleryImages)
  const [stats, setStats] = useState<SiteStats>(defaultData.stats)

  const [journalIndex, setJournalIndex] = useState<JournalIndexItem[]>([])
  const [activeJournalSlug, setActiveJournalSlug] = useState<string | null>(null)
  const [activeJournalText, setActiveJournalText] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        const [peaksRes, tripsRes, galleryRes, statsRes] = await Promise.all([
          fetch('/content/peaks.json'),
          fetch('/content/tripReports.json'),
          fetch('/content/gallery.json'),
          fetch('/content/site.json'),
        ])

        const toItems = <T,>(v: any): T[] => (Array.isArray(v) ? v : (v?.items ?? []))

        if (peaksRes.ok) setPeaks(toItems<Peak>(await peaksRes.json()))
        if (tripsRes.ok) setTripReports(toItems<TripReport>(await tripsRes.json()))
        if (galleryRes.ok) setGalleryImages(toItems<GalleryImage>(await galleryRes.json()))
        if (statsRes.ok) setStats(await statsRes.json())
      } catch {
        // no-op
      }
    }

    load()
  }, [])

  useEffect(() => {
    const loadJournalIndex = async () => {
      try {
        const res = await fetch('/journal/index.json')
        if (!res.ok) return
        const json = await res.json()
        const items: JournalIndexItem[] = Array.isArray(json) ? json : (json?.items ?? [])
        setJournalIndex(items)
        if (!activeJournalSlug && items.length) {
          setActiveJournalSlug(items[0].slug)
        }
      } catch {
        // no-op
      }
    }

    loadJournalIndex()
  }, [])

  useEffect(() => {
    const loadEntry = async () => {
      if (!activeJournalSlug) return
      const item = journalIndex.find((x) => x.slug === activeJournalSlug)
      if (!item) return

      try {
        const res = await fetch(item.file)
        if (!res.ok) return
        const raw = await res.text()
        const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/m, '')
        setActiveJournalText(withoutFrontmatter.trim())
      } catch {
        // no-op
      }
    }

    loadEntry()
  }, [activeJournalSlug, journalIndex])

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
              <span>Member since {stats.memberSince}</span>
              <span className="text-[var(--border)]">|</span>
              <span>{stats.homeBase}</span>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px">
            {[
              { id: 'overview', label: 'Overview', icon: Compass },
              { id: 'journal', label: 'Journal', icon: Calendar },
              { id: 'adventures', label: 'Adventures', icon: BookOpen },
              { id: 'projects', label: 'Projects', icon: Mountain },
              { id: 'stats-map', label: 'Stats+Map', icon: TrendingUp },
              { id: 'gallery', label: 'Gallery', icon: Camera },
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
          <Journal
            journalIndex={journalIndex}
            activeJournalSlug={activeJournalSlug}
            activeJournalText={activeJournalText}
            onSelectJournal={setActiveJournalSlug}
          />
        )}

        {activeTab === 'adventures' && <Adventures tripReports={tripReports} />}

        {activeTab === 'projects' && <Projects peaks={peaks} />}

        {activeTab === 'stats-map' && <StatsMap stats={stats} />}

        {activeTab === 'gallery' && (
          <Gallery galleryImages={galleryImages} onSelectImage={setSelectedImage} />
        )}
      </main>

      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold">Nivo Journal</span>
            </div>
            <div className="text-center md:text-right">
              <p>© 2024 Nivo Journal. All rights reserved.</p>
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
