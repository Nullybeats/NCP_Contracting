import { motion } from 'motion/react'
import type { Audience } from '@/components/AudienceGate'

const COPY = {
  homeowner: {
    eyebrow: 'General Contractor · Residential',
    title: ['Your project. Built right.', 'Delivered on time.'],
    body:
      'Full-service general contracting for homeowners and businesses — one team, one point of contact, finished when we said it would be.',
    primaryCta: 'Get a free estimate',
  },
  developer: {
    eyebrow: 'Commercial · Turnkey Subcontractor Scope',
    title: ['Turnkey delivery.', 'Every trade, one GC.'],
    body:
      'Multi-faceted commercial buildouts handled end-to-end — framing through finishes, MEP coordination, permits, and closeout under a single point of accountability. Predictable schedules, owner-ready handoff.',
    primaryCta: 'Request a bid package',
  },
} as const

export function Hero({ audience = 'homeowner' }: { audience?: Audience }) {
  const c = COPY[audience]
  return (
    <section
      id="top"
      className="relative h-svh w-full overflow-hidden bg-neutral-950 text-white"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={audience === 'developer' ? '/projects/developer-hero.mp4' : '/hero.mp4'}
        poster={audience === 'developer' ? '/projects/developer-hero.jpg' : '/hero-poster.jpg'}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      <div className="relative z-10 h-full max-w-6xl mx-auto px-8 sm:px-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs sm:text-sm tracking-[0.4em] uppercase text-blue-400/90 mb-8"
        >
          {c.eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight max-w-4xl leading-[1.05]"
        >
          {c.title[0]}
          <br />
          <span className="text-white/70">{c.title[1]}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-8 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed"
        >
          {c.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white text-sm tracking-[0.2em] uppercase px-7 py-4 rounded-sm transition-colors"
          >
            {c.primaryCta}
            <span className="block w-6 h-px bg-white/80 group-hover:w-10 transition-all" />
          </a>
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 border border-white/30 hover:border-white text-white text-sm tracking-[0.2em] uppercase px-7 py-4 rounded-sm transition-colors"
          >
            See our work
          </a>
        </motion.div>
      </div>

      {/* subtle scroll cue */}
      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-white/50 hover:text-white transition"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block w-1.5 h-1.5 border-r border-b border-white/70 rotate-45"
        />
      </motion.a>
    </section>
  )
}
