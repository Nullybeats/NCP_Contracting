import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Audience } from '@/components/AudienceGate'

const RESIDENTIAL_SERVICES = [
  {
    title: 'New Construction',
    body: 'Ground-up residential and light commercial builds, from foundation to final walk-through.',
  },
  {
    title: 'Remodels & Additions',
    body: 'Kitchens, baths, additions, and full-home renovations done with care for the original structure.',
  },
  {
    title: 'Decks & Exteriors',
    body: 'Custom decks, siding, and exterior finish work built to handle the weather and the years.',
  },
  {
    title: 'Concrete & Foundations',
    body: 'Footings, slabs, driveways, and foundation repair done right the first time.',
  },
  {
    title: 'Custom Carpentry',
    body: 'Built-ins, trim work, and finish carpentry that elevates the rest of the project.',
  },
  {
    title: 'Project Management',
    body: 'End-to-end coordination of subs, permits, and timelines — one point of contact, no surprises.',
  },
]

const COMMERCIAL_SERVICES = [
  {
    title: 'Turnkey General Contracting',
    body: 'Single-source delivery from preconstruction through closeout. One contract, one schedule, one point of accountability.',
  },
  {
    title: 'Multi-Trade Subcontractor Management',
    body: 'Vetted subs across framing, MEP, drywall, finishes, and more — procured, scheduled, and supervised by our team.',
  },
  {
    title: 'Tenant Improvements & Buildouts',
    body: 'Restaurant, retail, office, and medical buildouts. Permits to punch list, minimum disruption to neighboring tenants.',
  },
  {
    title: 'Multi-Unit & Mixed-Use',
    body: 'Townhomes, multi-family, and mixed-use ground-up. Scaled crews, phased delivery, investor-ready handoff.',
  },
  {
    title: 'MEP & Trade Coordination',
    body: 'Mechanical, electrical, and plumbing coordinated against the architectural sequence so trades hand off cleanly.',
  },
  {
    title: 'Schedule, Budget & Closeout',
    body: 'Weekly draws, progress photos, RFI / submittal tracking, final inspections, and full closeout documentation.',
  },
]

export function ServicesGrid({ audience = 'homeowner' }: { audience?: Audience }) {
  const isCommercial = audience === 'developer'
  const SERVICES = isCommercial ? COMMERCIAL_SERVICES : RESIDENTIAL_SERVICES
  const eyebrow = isCommercial ? 'Capabilities' : 'Services'
  const heading = isCommercial ? 'What we deliver.' : 'What we build.'
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section
      id="services"
      ref={ref}
      className="relative bg-neutral-950 text-white py-28 sm:py-40"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm tracking-[0.4em] uppercase text-blue-400/80 mb-6"
        >
          {eyebrow}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-3xl"
        >
          {heading}
        </motion.h2>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.07 }}
              className="group relative bg-neutral-950 p-8 sm:p-10 min-h-[260px] flex flex-col justify-between transition-colors hover:bg-neutral-900"
            >
              <div className="text-xs tracking-[0.3em] uppercase text-blue-400/70">
                0{i + 1}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  {s.body}
                </p>
              </div>
              <span className="absolute top-0 right-0 w-10 h-px bg-blue-500 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
