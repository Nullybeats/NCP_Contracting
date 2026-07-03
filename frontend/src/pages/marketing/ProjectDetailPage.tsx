import { useState } from 'react'
import { motion } from 'motion/react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { PageHero } from '@/components/marketing/PageHero'
import { CtaBand } from '@/components/marketing/CtaBand'
import {
  CATEGORY_LABEL,
  findProject,
  relatedProjects,
} from '@/lib/projects-data'

export function ProjectDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const project = findProject(slug)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (!project) return <Navigate to="/projects" replace />

  const related = relatedProjects(project, 2)

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Projects', to: '/projects' },
          { label: project.title },
        ]}
        eyebrow={project.categories.map((c) => CATEGORY_LABEL[c]).join(' · ')}
        title={project.title}
        intro={
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span>{project.location}</span>
            {project.year && <span>· {project.year}</span>}
          </div>
        }
        bg={project.cover}
      />

      <section className="relative bg-neutral-950 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-8 sm:px-16 grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-8">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-blue-400/80 mb-3">Scope</div>
              <ul className="space-y-2 text-sm text-white/80">
                {project.scope.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-blue-400/80 mb-3">Categories</div>
              <div className="flex flex-wrap gap-1.5">
                {project.categories.map((c) => (
                  <span key={c} className="text-[10px] tracking-[0.3em] uppercase text-white/70 border border-white/20 px-2 py-1 rounded-sm">
                    {CATEGORY_LABEL[c]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-blue-400/80 mb-3">Overview</div>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">{project.description}</p>
          </div>
        </div>
      </section>

      {project.video && (
        <section className="relative bg-black py-16 sm:py-24 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <video
              src={project.video.src}
              poster={project.video.poster}
              controls
              playsInline
              className="w-full rounded-sm"
            />
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="relative bg-neutral-950 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-8 sm:px-16">
            <div className="mb-8 text-xs tracking-[0.4em] uppercase text-blue-400/80">Gallery</div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {project.gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setLightboxIdx(i)}
                  className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-900"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="relative bg-black py-20 sm:py-28 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-8 sm:px-16">
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-2">Related</div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">More projects</h2>
              </div>
              <Link to="/projects" className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-white transition">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/projects/${r.slug}`}
                  className="group relative aspect-[16/10] overflow-hidden rounded-sm bg-neutral-900 block"
                >
                  <img src={r.cover} alt={r.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-blue-400/90 mb-2">{r.categories[0] && CATEGORY_LABEL[r.categories[0]]}</div>
                    <div className="text-xl font-semibold tracking-tight">{r.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Ready to start your project?"
        primary={{ label: 'Request an estimate', to: '/contact' }}
        secondary={{ label: 'See more work', to: '/projects' }}
      />

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null) }}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-sm tracking-[0.3em] uppercase"
          >
            Close ×
          </button>
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl"
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          {lightboxIdx < project.gallery.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl"
              aria-label="Next"
            >
              ›
            </button>
          )}
          <motion.img
            key={lightboxIdx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={project.gallery[lightboxIdx]}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 tracking-[0.2em]">
            {lightboxIdx + 1} / {project.gallery.length}
          </div>
        </motion.div>
      )}
    </>
  )
}
