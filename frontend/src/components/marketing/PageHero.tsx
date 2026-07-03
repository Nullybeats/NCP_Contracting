import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  breadcrumb?: { label: string; to?: string }[]
  bg?: string
}

export function PageHero({ eyebrow, title, intro, breadcrumb, bg }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-44 sm:pb-24 border-b border-white/10">
      {bg && (
        <>
          <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-neutral-950/80 to-neutral-950" />
        </>
      )}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background:radial-gradient(circle_at_70%_20%,#3b82f6,transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 sm:px-16">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-8 flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>·</span>}
                {b.to ? (
                  <Link to={b.to} className="hover:text-white transition">{b.label}</Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-blue-400/90 mb-6"
        >
          {eyebrow}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed"
          >
            {intro}
          </motion.div>
        )}
      </div>
    </section>
  )
}
