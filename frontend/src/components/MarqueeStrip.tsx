import { motion } from 'motion/react'
import type { Audience } from '@/components/AudienceGate'

const RESIDENTIAL_ITEMS = [
  'Built on trust',
  'Delivered with quality',
  'Residential',
  'Commercial',
  'New construction',
  'Remodels',
  'Additions',
  'Finish carpentry',
]

const COMMERCIAL_ITEMS = [
  'Turnkey delivery',
  'Single-source GC',
  'Multi-trade coordination',
  'Tenant improvements',
  'Multi-unit',
  'MEP coordination',
  'Permits & closeout',
  'Built on trust',
]

export function MarqueeStrip({ audience = 'homeowner' }: { audience?: Audience }) {
  const ITEMS = audience === 'developer' ? COMMERCIAL_ITEMS : RESIDENTIAL_ITEMS
  const loop = [...ITEMS, ...ITEMS]
  return (
    <section className="relative overflow-hidden bg-black border-y border-white/10 py-6">
      <motion.div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-12 text-xl sm:text-3xl font-medium tracking-tight text-white/80"
          >
            <span>{item}</span>
            <span className="text-blue-500/70">◆</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
