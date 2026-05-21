import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

const STATS = [
  { value: '10+', label: 'Years building' },
  { value: '120', label: 'Projects delivered' },
  { value: '100%', label: 'Client referrals' },
  { value: '15', label: 'Trusted subs' },
]

export function StatsStrip() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={ref}
      className="relative bg-black text-white border-y border-white/10"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16 py-20 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="text-5xl sm:text-6xl font-semibold tracking-tight text-white">
              {s.value}
            </div>
            <div className="mt-3 text-xs tracking-[0.3em] uppercase text-white/50">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
