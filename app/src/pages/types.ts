export type Peak = { name: string; elevation: string; location: string; date: string; type: string }
export type TripReport = { title: string; date: string; views: number; comments: number }
export type GalleryImage = { src: string; caption: string; date: string }
export type SiteStats = {
  peaksClimbed: number
  totalElevation: string
  tripReports: number
  photos: number
  memberSince: string
  homeBase: string
}

export type JournalIndexItem = { slug: string; title: string; date: string; tags: string[]; file: string }
