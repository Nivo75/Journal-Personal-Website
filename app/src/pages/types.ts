export type Peak = { name: string; elevation: string; location: string; date: string; type: string }

export type TripReport = { 
  title: string
  date: string
  views: number
  comments: number
  continent: 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania'
}

export type Project = {
  title: string
  category: 'Woodworking' | 'Crafting' | 'Digital' | 'Engineering' | 'Business' | 'Rockhounding' | 'Electronics' | 'Metallurgy' | 'Photography' | 'Social'
  description: string
  date: string
  status: 'completed' | 'in-progress' | 'planned'
  image?: string
}

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
