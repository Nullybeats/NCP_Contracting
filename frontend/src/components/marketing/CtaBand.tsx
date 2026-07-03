import { motion, useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  eyebrow?: string
  title: ReactNode
  primary?: { label: string; to: string }
  secondary?: { label: string; to: string }
}

export function CtaBand({ eyebrow = 'Ready to build', title, primary, secondary }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-neutral-950 via-black to-neutral-950 py-24 sm:py-32 border-y border-white/10"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16 flex flex-col items-start gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase text-blue-400/80"
        >
          {eyebrow}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 flex flex-wrap items-center gap-3"
        >
          {primary && (
            <Link
              to={primary.to}
              className="group inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white text-sm tracking-[0.2em] uppercase px-7 py-4 rounded-sm transition"
            >
              {primary.label}
              <span className="block w-6 h-px bg-white/80 group-hover:w-10 transition-all" />
            </Link>
          )}
          {secondary && (
            <Link
              to={secondary.to}
              className="inline-flex items-center gap-3 border border-white/30 hover:border-white text-white text-sm tracking-[0.2em] uppercase px-7 py-4 rounded-sm transition"
            >
              {secondary.label}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
