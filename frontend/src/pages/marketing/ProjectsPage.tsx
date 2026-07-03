import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/marketing/PageHero'
import { CtaBand } from '@/components/marketing/CtaBand'
import {
  CATEGORY_LABEL,
  PROJECTS,
  type MarketingProject,
  type ProjectCategory,
} from '@/lib/projects-data'
import { useSeo } from '@/lib/useSeo'

const FILTERS: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'new-construction', label: 'New Construction' },
  { value: 'remodel', label: 'Remodel' },
]

function ProjectCard({ project, span }: { project: MarketingProject; span: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={span}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group relative block h-full overflow-hidden rounded-sm bg-neutral-900"
      >
        <img
          src={project.cover}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex flex-wrap gap-1 mb-3">
            {project.categories.slice(0, 2).map((c) => (
              <span
                key={c}
                className="text-[10px] tracking-[0.3em] uppercase text-blue-300/90 border border-blue-400/30 px-2 py-0.5 rounded-sm bg-blue-500/10 backdrop-blur"
              >
                {CATEGORY_LABEL[c]}
              </span>
            ))}
          </div>
          <div className="text-xl sm:text-2xl font-semibold tracking-tight">{project.title}</div>
          <div className="text-xs text-white/60 mt-1">{project.location}{project.year ? ` · ${project.year}` : ''}</div>
        </div>
        <div className="absolute top-4 right-4 w-10 h-px bg-white/40 group-hover:bg-blue-400 group-hover:w-16 transition-all" />
      </Link>
    </motion.div>
  )
}

export function ProjectsPage() {
  useSeo({
    title: 'Projects',
    description:
      'Recent work by NCP Contracting across Tampa Bay — commercial buildouts, residential remodels, and multi-trade turnkey delivery.',
    path: '/projects',
  })
  const [params, setParams] = useSearchParams()
  const initial = (params.get('filter') as 'all' | ProjectCategory | null) ?? 'all'
  const [filter, setFilter] = useState<'all' | ProjectCategory>(initial)

  const filtered = useMemo(() => {
    if (filter === 'all') return PROJECTS
    return PROJECTS.filter((p) => p.categories.includes(filter))
  }, [filter])

  const setFilterAndUrl = (f: 'all' | ProjectCategory) => {
    setFilter(f)
    if (f === 'all') setParams({})
    else setParams({ filter: f })
  }

  const heroBg = PROJECTS[0]?.cover

  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
        eyebrow="Recent Work"
        title={<>Projects delivered.<br /><span className="text-white/60">On time, on scope.</span></>}
        intro="A snapshot of jobs across Tampa Bay — commercial buildouts, residential remodels, and multi-trade delivery under a single-source GC."
        bg={heroBg}
      />

      <section className="relative bg-neutral-950 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => setFilterAndUrl(f.value)}
                  className={`text-xs tracking-[0.25em] uppercase px-4 py-2.5 rounded-sm border transition ${
                    active
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-white/50 text-sm">
              No projects in this category yet. <button onClick={() => setFilterAndUrl('all')} className="text-blue-400 hover:underline">Show all</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 auto-rows-[220px] sm:auto-rows-[260px]">
              {filtered.map((p, i) => {
                // varied spans for a masonry feel
                const spanPatterns = [
                  'sm:col-span-2 sm:row-span-2',
                  'sm:col-span-1 sm:row-span-1',
                  'sm:col-span-2 sm:row-span-1',
                  'sm:col-span-1 sm:row-span-1',
                  'sm:col-span-1 sm:row-span-2',
                  'sm:col-span-2 sm:row-span-1',
                ]
                const span = `${spanPatterns[i % spanPatterns.length]} min-h-[220px]`
                return <ProjectCard key={p.slug} project={p} span={span} />
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        eyebrow="Have a project?"
        title="Let's talk scope, budget, and timeline."
        primary={{ label: 'Request an estimate', to: '/contact' }}
        secondary={{ label: 'Our services', to: '/services' }}
      />
    </>
  )
}
