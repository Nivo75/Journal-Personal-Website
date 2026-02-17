import { Calendar } from 'lucide-react'
import { type GalleryImage } from './types'

type GalleryProps = {
  galleryImages: GalleryImage[]
  onSelectImage: (src: string) => void
}

export function Gallery({ galleryImages, onSelectImage }: GalleryProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title">Photo Gallery</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          Selected photos from recent trips and projects. Click on any image to view full size.
        </p>
      </div>

      {/* Gallery Grid */}
      {galleryImages.length === 0 ? (
        <div className="box">
          <div className="p-6 text-sm text-[var(--text-muted)] italic text-center">
            No gallery items yet — first images coming soon.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {galleryImages.map((img, i) => (
            <div key={i} className="entry-card project">
              <div className="entry-dot"></div>
              <div className="p-3">
                <div 
                  className="thumb cursor-pointer mb-3" 
                  onClick={() => onSelectImage(img.src)}
                >
                  <img 
                    src={img.src} 
                    alt={img.caption} 
                    className="w-full h-48 object-cover" 
                  />
                </div>
                <div className="text-sm text-[var(--text-primary)] font-medium mb-1">
                  {img.caption}
                </div>
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {img.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
