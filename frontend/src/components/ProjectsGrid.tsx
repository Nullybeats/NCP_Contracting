import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

type Project = {
  title: string
  type: string
  imageUrl?: string
  /** tailwind classes for the grid placement of this tile */
  span: string
}

const PROJECTS: Project[] = [
  {
    title: 'Master Bath Remodel',
    type: 'Residential · Remodel',
    imageUrl: '/projects/bath-01.png',
    span: 'sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto',
  },
  {
    title: 'Kitchen Renovation',
    type: 'Residential · Remodel',
    span: 'aspect-square',
  },
  {
    title: 'New Build',
    type: 'Residential · Construction',
    span: 'aspect-square',
  },
  {
    title: 'Deck & Pergola',
    type: 'Residential · Exterior',
    span: 'sm:col-span-2 aspect-[4/3] sm:aspect-[2/1]',
  },
]

export function ProjectsGrid() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section
      id="projects"
      ref={ref}
      className="relative bg-neutral-950 text-white py-28 sm:py-40"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm tracking-[0.4em] uppercase text-blue-400/80 mb-6"
            >
              Projects
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]"
            >
              Recent work.
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            href="#"
            className="group inline-flex items-center gap-3 text-sm tracking-[0.3em] uppercase text-white/70 hover:text-blue-400 transition"
          >
            View all
            <span className="block w-10 h-px bg-white/30 group-hover:bg-blue-400 group-hover:w-16 transition-all" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.title}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
              className={`group relative overflow-hidden bg-neutral-900 rounded-sm ${p.span}`}
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-blue-400/80 mb-2">
                  {p.type}
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight">
                  {p.title}
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-px bg-white/40 group-hover:bg-blue-400 group-hover:w-16 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
