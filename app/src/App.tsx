import { useEffect, useState } from 'react'
import './App.css'
import { 
  Mountain, 
  Camera, 
  BookOpen, 
  User,
  Calendar,
  TrendingUp,
  Compass,
  ExternalLink,
} from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import profileContent from './content/profile.json'
import projectsContent from './content/projects.json'
import tripsContent from './content/trips.json'
import photosContent from './content/photos.json'

type Project = { name: string; elevation: string; location: string; date: string; type: string }
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

const toItems = <T,>(value: unknown): T[] =>
  Array.isArray(value)
    ? value as T[]
    : (typeof value === 'object' && value !== null && Array.isArray((value as { items?: unknown[] }).items)
      ? ((value as { items: T[] }).items)
      : [])

const EMPTY_STATS: SiteStats = {
  peaksClimbed: Number(profileContent.peaksClimbed ?? 0),
  totalElevation: String(profileContent.totalElevation ?? '0 ft'),
  tripReports: Number(profileContent.tripReports ?? 0),
  photos: Number(profileContent.photos ?? 0),
  memberSince: String(profileContent.memberSince ?? '—'),
  homeBase: String(profileContent.homeBase ?? '—'),
}

const emptyState = (title: string, description: string) => (
  <Empty className="border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-6">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Mountain className="size-5" />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
)

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [projects, setProjects] = useState<Project[]>(toItems<Project>(projectsContent))
  const [tripReports, setTripReports] = useState<TripReport[]>(toItems<TripReport>(tripsContent))
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(toItems<GalleryImage>(photosContent))
  const [stats, setStats] = useState<SiteStats>(EMPTY_STATS)

  const [journalIndex, setJournalIndex] = useState<JournalIndexItem[]>([])
  const [activeJournalSlug, setActiveJournalSlug] = useState<string | null>(null)
  const [activeJournalText, setActiveJournalText] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, tripsRes, photosRes, statsRes] = await Promise.all([
          fetch('/content/projects.json'),
          fetch('/content/trips.json'),
          fetch('/content/photos.json'),
          fetch('/content/profile.json'),
        ])

        if (projectsRes.ok) setProjects(toItems<Project>(await projectsRes.json()))
        if (tripsRes.ok) setTripReports(toItems<TripReport>(await tripsRes.json()))
        if (photosRes.ok) setGalleryImages(toItems<GalleryImage>(await photosRes.json()))
        if (statsRes.ok) {
          const incoming = await statsRes.json()
          setStats({
            peaksClimbed: Number(incoming?.peaksClimbed ?? 0),
            totalElevation: String(incoming?.totalElevation ?? '0 ft'),
            tripReports: Number(incoming?.tripReports ?? 0),
            photos: Number(incoming?.photos ?? 0),
            memberSince: String(incoming?.memberSince ?? '—'),
            homeBase: String(incoming?.homeBase ?? '—'),
          })
        }
      } catch {
        // no-op: local src/content defaults remain active
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
        const items: JournalIndexItem[] = toItems<JournalIndexItem>(json)
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
      if (!activeJournalSlug) {
        setActiveJournalText('')
        return
      }

      const item = journalIndex.find((x) => x.slug === activeJournalSlug)
      if (!item) {
        setActiveJournalText('')
        return
      }

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

      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="box">
              <div className="box-header">Hero</div>
              <div className="p-4">
                <video
                  src="/media/hero.mp4"
                  controls
                  playsInline
                  className="w-full rounded border border-[var(--border)] bg-black"
                >
                  Your browser does not support the hero video.
                </video>
                <p className="text-xs text-[var(--text-muted)] mt-2">Overview hero media: /media/hero.mp4</p>
              </div>
            </div>
            {/* Welcome Box */}
        {activeTab === 'home' && (
          <div className="space-y-6">
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
                <div className="stat-label">Adventures</div>
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
                    {projects.slice(0, 5).map((project) => (
                      <tr key={`${project.name}-${project.date}`} className="cursor-pointer">
                        <td className="text-[var(--link)]">{project.name}</td>
                        <td>{project.location}</td>
                        <td>{project.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Adventures */}
              <div className="box">
                <div className="box-header flex items-center justify-between">
                  <span>Recent Adventures</span>
                  <button 
                    onClick={() => setActiveTab('adventures')}
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
                  {tripReports.length === 0 ? (
              <div className="box">
                <div className="p-4 text-sm text-[var(--text-muted)]">No adventures yet — first entries coming soon.</div>
              </div>
            ) : tripReports.map((report, i) => (
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
                {tripReports.length === 0 ? (
                  <div className="p-4">{emptyState('No trips yet', 'First entries are coming soon.')}</div>
                ) : (
                  <ul className="list-plain">
                    {tripReports.slice(0, 5).map((report) => (
                      <li key={`${report.title}-${report.date}`} className="flex items-center justify-between py-3">
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
                )}
              </div>
            </div>

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
                {galleryImages.length === 0 ? (
                  emptyState('No photos yet', 'A photo gallery is coming soon.')
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {galleryImages.map((img) => (
                      <div
                        key={`${img.src}-${img.date}`}
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
                )}
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
              {peaks.length === 0 ? (
                <div className="p-4 text-sm text-[var(--text-muted)]">No projects yet — first entries coming soon.</div>
              ) : (
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
                  {projects.map((project, i) => (
                    <tr key={`${project.name}-${project.date}`}>
                      <td className="text-[var(--text-muted)]">{i + 1}</td>
                      <td className="text-[var(--link)] cursor-pointer hover:underline">{project.name}</td>
                      <td>{project.elevation}</td>
                      <td>{project.location}</td>
                      <td><span className="tag">{project.type}</span></td>
                      <td>{project.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        )}

        {/* ADVENTURES TAB */}
        {activeTab === 'adventures' && (
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="box">
              <div className="box-header">Adventures</div>
              <div className="p-4">
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  Detailed accounts of selected trips including route conditions, gear used, and lessons learned.
                </p>
              </div>
            </div>
            {tripReports.length === 0 ? (
              <div className="box">
                <div className="p-4 text-sm text-[var(--text-muted)]">No adventures yet — first entries coming soon.</div>
              </div>
            ) : tripReports.map((report, i) => (
              <div key={i} className="box">
            {tripReports.map((report) => (
              <div key={`${report.title}-${report.date}`} className="box">
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
                      Read Entry
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="box md:col-span-1">
              <div className="box-header">Journal Entries</div>
              <div className="p-3">
                {journalIndex.length === 0 ? (
                  emptyState('No journal entries yet', 'Add your first entry from /admin.')
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
            {galleryImages.length === 0 ? (
              <div className="box">
                <div className="p-4 text-sm text-[var(--text-muted)]">No gallery items yet — first images coming soon.</div>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* STATS+MAP TAB */}
        {activeTab === 'stats-map' && (
          <div className="space-y-4">
            <div className="box">
              <div className="box-header">Stats Snapshot</div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="stat-number">{stats.peaksClimbed}</div>
                    <div className="stat-label">Routes Completed</div>
                  </div>
                  <div>
                    <div className="stat-number">{stats.totalElevation}</div>
                    <div className="stat-label">Total Elevation</div>
                  </div>
                  <div>
                    <div className="stat-number">{stats.tripReports}</div>
                    <div className="stat-label">Trips Logged</div>
                  </div>
                  <div>
                    <div className="stat-number">{stats.photos}</div>
                    <div className="stat-label">Photos</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="box-header">Map</div>
              <div className="p-4 text-sm text-[var(--text-muted)]">
                Map layer not connected yet — map data integration is coming soon.
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
