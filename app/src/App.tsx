import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { 
  Mountain, 
  Camera, 
  BookOpen, 
  User,
  Calendar,
  TrendingUp,
  Compass,
  ExternalLink
} from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  type Peak = { name: string; elevation: string; location: string; date: string; type: string }
  type TripReport = { title: string; date: string; views: number; comments: number }
  type GalleryImage = { src: string; caption: string; date: string }
  type SiteStats = {
    peaksClimbed: number
    totalElevation: string
    tripReports: number
    photos: number
    memberSince: string
    homeBase: string
  }

  type JournalIndexItem = { slug: string; title: string; date: string; tags: string[]; file: string }

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
    // Content is stored as static JSON so a Git-backed CMS (Decap) can edit it.
    // If fetch fails (e.g., first run), we fall back to the built-in defaults.
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
    // Load journal index (generated during build) so you can add entries via CMS.
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

        // Strip frontmatter for display
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
      {/* Header */}
      <header className="bg-[var(--header-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top bar */}
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
          
          {/* Navigation */}
          <nav className="flex gap-1 -mb-px">
            {[
              { id: 'home', label: 'Home', icon: Compass },
              { id: 'journal', label: 'Journal', icon: Calendar },
              { id: 'trips', label: 'Trips', icon: BookOpen },
              { id: 'projects', label: 'Projects', icon: Mountain },
              { id: 'photos', label: 'Photos', icon: Camera },
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Box */}
            <div className="box">
              <div className="box-header">Welcome to My Personal Site</div>
              <div className="p-4">
                <p className="text-[var(--text-secondary)] mb-4">
                  This is a home for my notes, adventures, and projects in the Pacific Northwest and beyond.
                  I use it to keep a running record of experiences, route details, and ideas over time.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Use the navigation above to explore journal entries, trip write-ups, project logs,
                  and photos from the trail.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="box text-center p-4">
                <div className="stat-number">{stats.peaksClimbed}</div>
                <div className="stat-label">Routes Completed</div>
              </div>
              <div className="box text-center p-4">
                <div className="stat-number">{stats.totalElevation}</div>
                <div className="stat-label">Total Elevation</div>
              </div>
              <div className="box text-center p-4">
                <div className="stat-number">{stats.tripReports}</div>
                <div className="stat-label">Trip Reports</div>
              </div>
              <div className="box text-center p-4">
                <div className="stat-number">{stats.photos}</div>
                <div className="stat-label">Photos</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="box">
                <div className="box-header flex items-center justify-between">
                  <span>Recent Projects</span>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="text-[var(--link)] text-xs hover:underline"
                  >
                    View All
                  </button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Region</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peaks.slice(0, 5).map((peak, i) => (
                      <tr key={i} className="cursor-pointer">
                        <td className="text-[var(--link)]">{peak.name}</td>
                        <td>{peak.elevation}</td>
                        <td>{peak.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Trip Reports */}
              <div className="box">
                <div className="box-header flex items-center justify-between">
                  <span>Recent Trip Reports</span>
                  <button 
                    onClick={() => setActiveTab('trips')}
                    className="text-[var(--link)] text-xs hover:underline"
                  >
                    View All
                  </button>
                </div>
                <ul className="list-plain">
                  {tripReports.map((report, i) => (
                    <li key={i} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-[var(--link)] text-sm">{report.title}</div>
                        <div className="text-[var(--text-muted)] text-xs">{report.date}</div>
                      </div>
                      <div className="text-right text-xs text-[var(--text-muted)]">
                        <div>{report.views} views</div>
                        <div>{report.comments} comments</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Latest Photos Preview */}
            <div className="box">
              <div className="box-header flex items-center justify-between">
                <span>Latest Photos</span>
                <button 
                  onClick={() => setActiveTab('photos')}
                  className="text-[var(--link)] text-xs hover:underline"
                >
                  View Gallery
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {galleryImages.map((img, i) => (
                    <div 
                      key={i} 
                      className="thumb cursor-pointer"
                      onClick={() => setSelectedImage(img.src)}
                    >
                      <img 
                        src={img.src} 
                        alt={img.caption}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="box">
            <div className="box-header">Projects</div>
            <div className="p-4">
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                A running list of ongoing and completed field projects, sorted by date.
                Select any entry to review notes, location details, and related trip context.
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project</th>
                    <th>Distance / Gain</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {peaks.map((peak, i) => (
                    <tr key={i}>
                      <td className="text-[var(--text-muted)]">{i + 1}</td>
                      <td className="text-[var(--link)] cursor-pointer hover:underline">{peak.name}</td>
                      <td>{peak.elevation}</td>
                      <td>{peak.location}</td>
                      <td><span className="tag">{peak.type}</span></td>
                      <td>{peak.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRIPS TAB */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="box">
              <div className="box-header">Trip Reports</div>
              <div className="p-4">
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  Detailed accounts of selected trips including route conditions, gear used, and lessons learned.
                </p>
              </div>
            </div>
            {tripReports.map((report, i) => (
              <div key={i} className="box">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[var(--link)] cursor-pointer hover:underline">
                      {report.title}
                    </h3>
                    <span className="tag">{report.date}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-3">
                    Trip report detailing the route, conditions, and key decision points from the outing.
                    Includes photos and GPS track where available.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {report.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.comments} comments
                    </span>
                    <button className="text-[var(--link)] hover:underline flex items-center gap-1 ml-auto">
                      Read Report
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
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
                    {journalIndex.map((e) => (
                      <li
                        key={e.slug}
                        className={`py-2 cursor-pointer ${activeJournalSlug === e.slug ? 'text-[var(--link)]' : 'text-[var(--text-primary)]'}`}
                        onClick={() => setActiveJournalSlug(e.slug)}
                      >
                        <div className="text-sm font-medium hover:underline">{e.title}</div>
                        <div className="text-xs text-[var(--text-muted)]">{e.date}</div>
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
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="box">
              <div className="box-header">Photo Gallery</div>
              <div className="p-4">
                <p className="text-[var(--text-secondary)] text-sm">
                  Selected photos from recent trips and projects. Click on any image to view full size.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="box p-2">
                  <div 
                    className="thumb cursor-pointer mb-2"
                    onClick={() => setSelectedImage(img.src)}
                  >
                    <img 
                      src={img.src} 
                      alt={img.caption}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="text-sm text-[var(--text-primary)]">{img.caption}</div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {img.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
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

      {/* Image Modal */}
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
