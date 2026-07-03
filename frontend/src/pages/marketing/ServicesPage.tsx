import { useState, useMemo } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CtaBand } from '@/components/marketing/CtaBand'
import { ProcessSteps } from '@/components/ProcessSteps'
import { useSeo } from '@/lib/useSeo'
import { ShieldCheck, Hammer, Building2, MapPin } from 'lucide-react'
import type { Audience } from '@/components/AudienceGate'

type Service = {
  title: string
  body: string
  audience: Audience
}

const SERVICES: Service[] = [
  { audience: 'homeowner', title: 'New Construction', body: 'Ground-up residential and light commercial builds, from foundation to final walk-through.' },
  { audience: 'homeowner', title: 'Remodels & Additions', body: 'Kitchens, baths, additions, and full-home renovations done with care for the original structure.' },
  { audience: 'homeowner', title: 'Decks & Exteriors', body: 'Custom decks, siding, and exterior finish work built to handle the weather and the years.' },
  { audience: 'homeowner', title: 'Concrete & Foundations', body: 'Footings, slabs, driveways, and foundation repair done right the first time.' },
  { audience: 'homeowner', title: 'Custom Carpentry', body: 'Built-ins, trim work, and finish carpentry that elevates the rest of the project.' },
  { audience: 'homeowner', title: 'Project Management', body: 'End-to-end coordination of subs, permits, and timelines — one point of contact, no surprises.' },
  { audience: 'developer', title: 'Turnkey General Contracting', body: 'Single-source delivery from preconstruction through closeout. One contract, one schedule, one point of accountability.' },
  { audience: 'developer', title: 'Multi-Trade Subcontractor Management', body: 'Vetted subs across framing, MEP, drywall, finishes, and more — procured, scheduled, and supervised by our team.' },
  { audience: 'developer', title: 'Tenant Improvements & Buildouts', body: 'Restaurant, retail, office, and medical buildouts. Permits to punch list, minimum disruption to neighboring tenants.' },
  { audience: 'developer', title: 'Multi-Unit & Mixed-Use', body: 'Townhomes, multi-family, and mixed-use ground-up. Scaled crews, phased delivery, investor-ready handoff.' },
  { audience: 'developer', title: 'MEP & Trade Coordination', body: 'Mechanical, electrical, and plumbing coordinated against the architectural sequence so trades hand off cleanly.' },
  { audience: 'developer', title: 'Schedule, Budget & Closeout', body: 'Weekly draws, progress photos, RFI / submittal tracking, final inspections, and full closeout documentation.' },
]

const STATS = [
  { icon: ShieldCheck, label: 'Licensed', value: 'CGC1541048' },
  { icon: Hammer, label: 'Insured', value: 'Fully covered' },
  { icon: Building2, label: 'Trades', value: '17+ managed' },
  { icon: MapPin, label: 'Service area', value: 'Tampa Bay' },
]

type Filter = 'all' | 'homeowner' | 'developer'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Services' },
  { value: 'homeowner', label: 'Residential' },
  { value: 'developer', label: 'Commercial' },
]

export function ServicesPage() {
  useSeo({
    title: 'Services',
    description:
      'Full-service general contracting across residential and commercial. Turnkey delivery from preconstruction through closeout — one team, one point of contact.',
    path: '/services',
  })
  const [params, setParams] = useSearchParams()
  const initial = (params.get('audience') as Filter | null) ?? 'all'
  const [filter, setFilter] = useState<Filter>(initial)
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-15% 0px' })

  const filtered = useMemo(() => {
    if (filter === 'all') return SERVICES
    return SERVICES.filter((s) => s.audience === filter)
  }, [filter])

  const setFilterAndUrl = (f: Filter) => {
    setFilter(f)
    if (f === 'all') setParams({})
    else setParams({ audience: f })
  }

  return (
    <>
      <ServicesHero filter={filter} />

      {/* Stats band */}
      <section className="relative bg-neutral-950 border-b border-white/10 py-14">
        <div className="max-w-6xl mx-auto px-8 sm:px-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center">
                <Icon className="h-4 w-4 text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">{label}</div>
                <div className="text-sm font-medium text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="relative bg-neutral-950 py-20 sm:py-28" ref={gridRef}>
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden"
            >
              {filtered.map((s, i) => (
                <motion.div
                  key={`${filter}-${s.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.04 * i }}
                  className="group relative bg-neutral-950 p-8 sm:p-10 min-h-[240px] flex flex-col justify-between transition-colors hover:bg-neutral-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs tracking-[0.3em] uppercase text-blue-400/70">
                      0{(i % 9) + 1}
                    </div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                      {s.audience === 'homeowner' ? 'Residential' : 'Commercial'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-sm text-white/60 leading-relaxed">{s.body}</p>
                  </div>
                  <span className="absolute top-0 right-0 w-10 h-px bg-blue-500 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter === 'developer' ? 'process-commercial' : 'process-residential'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProcessSteps audience={filter === 'developer' ? 'developer' : 'homeowner'} />
        </motion.div>
      </AnimatePresence>

      <CtaBand
        eyebrow="Have something in mind?"
        title={<>Tell us about the scope.<br /><span className="text-white/50">We&rsquo;ll take it from there.</span></>}
        primary={{ label: 'Request an estimate', to: '/contact' }}
        secondary={{ label: 'See our work', to: '/projects' }}
      />
    </>
  )
}

const HERO_CONTENT = {
  residential: {
    key: 'residential',
    bg: '/stock/services-hero.jpg',
    eyebrow: 'Capabilities',
    title: (
      <>What we build.<br /><span className="text-white/60">What we deliver.</span></>
    ),
    intro:
      'Full-service general contracting across residential and commercial. One team, one point of contact, from preconstruction through closeout.',
  },
  commercial: {
    key: 'commercial',
    bg: '/stock/services-hero-commercial.jpg',
    eyebrow: 'Commercial Capabilities',
    title: (
      <>Turnkey delivery.<br /><span className="text-white/60">Every trade, one GC.</span></>
    ),
    intro:
      'Multi-faceted commercial buildouts handled end-to-end — framing through finishes, MEP coordination, permits, and closeout under a single point of accountability.',
  },
} as const

function ServicesHero({ filter }: { filter: Filter }) {
  const isCommercial = filter === 'developer'
  const content = isCommercial ? HERO_CONTENT.commercial : HERO_CONTENT.residential
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-44 sm:pb-24 border-b border-white/10">
      {/* Cross-faded backgrounds */}
      <motion.img
        src={HERO_CONTENT.residential.bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={false}
        animate={{ opacity: isCommercial ? 0 : 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.img
        src={HERO_CONTENT.commercial.bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={false}
        animate={{ opacity: isCommercial ? 0.3 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-neutral-950/80 to-neutral-950" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background:radial-gradient(circle_at_70%_20%,#3b82f6,transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 sm:px-16">
        {/* Static breadcrumb — never animates */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>·</span>
          <span>Services</span>
        </nav>

        {/* Animated text swap */}
        <AnimatePresence mode="wait">
          <motion.div
            key={content.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-blue-400/90 mb-6">
              {content.eyebrow}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl">
              {content.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
              {content.intro}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
