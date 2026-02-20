import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type GalleryImage = {
  id: string
  image_url: string
  caption: string
  date: string
}

type GalleryProps = {
  onSelectImage: (src: string) => void
}

export function Gallery({ onSelectImage }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error loading gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="box">
        <div className="box-header">Photo Gallery</div>
        <div className="p-4">
          <p className="text-[var(--text-secondary)] text-sm">
            Selected photos from recent trips and projects. Click on any image to view full size.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="box">
          <div className="p-4 text-sm text-[var(--text-muted)] italic text-center">
            Loading gallery...
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="box">
          <div className="p-4 text-sm text-[var(--text-muted)] italic text-center">
            No gallery items yet — first images coming soon.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="box p-2">
              <div className="thumb cursor-pointer mb-2" onClick={() => onSelectImage(img.image_url)}>
                <img src={img.image_url} alt={img.caption} className="w-full h-48 object-cover" />
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
  )
}
