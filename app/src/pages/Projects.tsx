import { useState, useEffect } from 'react'
import { Wrench, Hammer, Monitor, Cog, Briefcase, Mountain as Rock, Cpu, Flame, Camera, Users } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type Project = {
  id: string
  title: string
  category: string
  description: string
  date: string
  status: 'completed' | 'in-progress' | 'planned'
  image_url?: string
}

type Category = 
  | 'Woodworking' 
  | 'Crafting' 
  | 'Digital' 
  | 'Engineering' 
  | 'Business' 
  | 'Rockhounding' 
  | 'Electronics' 
  | 'Metallurgy' 
  | 'Photography' 
  | 'Social'

const categories: Category[] = [
  'Woodworking',
  'Crafting',
  'Digital',
  'Engineering',
  'Business',
  'Rockhounding',
  'Electronics',
  'Metallurgy',
  'Photography',
  'Social'
]

const categoryIcons: Record<Category, any> = {
  'Woodworking': Hammer,
  'Crafting': Wrench,
  'Digital': Monitor,
  'Engineering': Cog,
  'Business': Briefcase,
  'Rockhounding': Rock,
  'Electronics': Cpu,
  'Metallurgy': Flame,
  'Photography': Camera,
  'Social': Users
}

const categoryColors: Record<Category, string> = {
  'Woodworking': 'var(--accent)',
  'Crafting': 'var(--accent-2)',
  'Digital': 'var(--accent-3)',
  'Engineering': 'var(--accent-4)',
  'Business': 'var(--accent)',
  'Rockhounding': 'var(--accent-2)',
  'Electronics': 'var(--accent-3)',
  'Metallurgy': 'var(--accent-4)',
  'Photography': 'var(--accent)',
  'Social': 'var(--accent-2)'
}

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects

  const projectsByCategory = categories.map(category => ({
    category,
    projects: projects.filter(p => p.category === category),
    count: projects.filter(p => p.category === category).length
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Projects</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          A collection of builds, experiments, and creative work across multiple disciplines.
          {selectedCategory && ` Currently viewing: ${selectedCategory}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 text-xs rounded transition-all ${
            selectedCategory === null
              ? 'bg-[var(--accent-2)] text-[var(--bg-primary)] border border-[var(--accent-2)]'
              : 'bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent-2)]'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          All ({projects.length})
        </button>
        {projectsByCategory.map(({ category, count }) => {
          const Icon = categoryIcons[category]
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1.5 ${
                selectedCategory === category
                  ? 'bg-[var(--accent-2)] text-[var(--bg-primary)] border border-[var(--accent-2)]'
                  : 'bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent-2)]'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Icon className="w-3 h-3" />
              {category} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-sm text-[var(--text-muted)] italic py-8 text-center">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="box">
          <div className="p-6 text-sm text-[var(--text-muted)] italic text-center">
            {selectedCategory 
              ? `No ${selectedCategory} projects yet.`
              : 'No projects yet — first entries coming soon.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const Icon = categoryIcons[project.category as Category]
            const color = categoryColors[project.category as Category]
            
            return (
              <div 
                key={project.id}
                className="entry-card project"
                style={{
                  borderTopColor: color
                }}
              >
                <div 
                  className="entry-dot" 
                  style={{ background: color }}
                />
                
                <div className="p-5">
                  <div 
                    className="flex items-center gap-1.5 mb-3"
                    style={{ 
                      fontSize: '0.625rem',
                      color: color,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px'
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {project.category}
                  </div>

                  <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 
                      className="text-lg font-[var(--font-header)] font-normal text-[var(--text-primary)]"
                      style={{ flex: 1 }}
                    >
                      {project.title}
                    </h3>
                    <span 
                      className="tag whitespace-nowrap text-xs"
                      style={{
                        background: project.status === 'completed' 
                          ? 'rgba(123, 158, 135, 0.15)'
                          : project.status === 'in-progress'
                          ? 'rgba(212, 165, 116, 0.15)'
                          : 'rgba(160, 99, 74, 0.15)',
                        color: project.status === 'completed'
                          ? 'var(--accent-4)'
                          : project.status === 'in-progress'
                          ? 'var(--accent-3)'
                          : 'var(--accent-2)'
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm mb-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="text-xs text-[var(--text-muted)]">
                    {project.date}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
