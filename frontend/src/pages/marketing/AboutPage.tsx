import { motion } from 'motion/react'
import { ShieldCheck, Award, MapPin, Handshake } from 'lucide-react'
import { PageHero } from '@/components/marketing/PageHero'
import { CtaBand } from '@/components/marketing/CtaBand'
import { useSeo } from '@/lib/useSeo'

const VALUES = [
  { icon: ShieldCheck, title: 'Trust', body: 'Say what we\'ll do, do what we said. No surprises on the invoice.' },
  { icon: Award, title: 'Quality', body: 'Finish work you\'d be proud to sign your name on — because we do.' },
  { icon: Handshake, title: 'Communication', body: 'Weekly updates, photos, and a real human answering the phone.' },
  { icon: MapPin, title: 'Local', body: 'Tampa Bay based, Tampa Bay hired. We show up on the job.' },
]

const CITIES = [
  'St. Petersburg', 'Tampa', 'Clearwater', 'Largo', 'Pinellas Park',
  'Seminole', 'Palm Harbor', 'Tarpon Springs', 'Dunedin', 'Safety Harbor',
  'Oldsmar', 'Gulfport', 'Treasure Island', 'St. Pete Beach',
]

export function AboutPage() {
  useSeo({
    title: 'About',
    description:
      'NCP Contracting is a Tampa Bay-based licensed general contractor (CGC1541048) serving residential and commercial clients. Built on trust, delivered with quality.',
    path: '/about',
  })
  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        eyebrow="About Us"
        title={<>Built on trust.<br /><span className="text-white/60">Delivered with quality.</span></>}
        intro="NCP Contracting is a Tampa Bay–based general contractor serving residential and commercial clients. One team, one point of contact, from first walk-through to final closeout."
        bg="/stock/about-hero.jpg"
      />

      {/* Story */}
      <section className="relative bg-neutral-950 py-20 sm:py-28 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-8 sm:px-16">
          <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">The story</div>
          <div className="space-y-6 text-base sm:text-lg text-white/75 leading-relaxed">
            <p>
              NCP Contracting was founded on a simple idea: do excellent work and treat people right.
              Today we build for homeowners, business owners, and developers across Tampa Bay who want a
              contractor that shows up, communicates, and finishes what they start.
            </p>
            <p>
              Nicholas Pejack — owner and general contractor — leads every project personally. Whether the
              scope is a residential kitchen or a multi-trade commercial buildout, the standard is the
              same: single-source delivery, clean job sites, and finish work you'd be proud to sign your
              name on.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative bg-neutral-950 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          <div className="mb-12">
            <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-4">Values</div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-3xl">
              What we run on.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-sm overflow-hidden">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.5, delay: 0.06 * i }}
                className="bg-neutral-950 p-8 min-h-[200px]"
              >
                <Icon className="h-6 w-6 text-blue-400 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials split with photo */}
      <section className="relative bg-black py-20 sm:py-28 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-8 sm:px-16 grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-sm">
            <img
              src="/stock/values-photo.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
          </div>
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">Credentials</div>
            <div className="space-y-6">
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">Owner / General Contractor</div>
                <div className="text-2xl font-semibold tracking-tight">Nicholas Pejack</div>
              </div>
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">Florida License</div>
                <div className="text-lg font-medium tracking-tight">CGC1541048</div>
              </div>
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">Insurance</div>
                <div className="text-lg font-medium tracking-tight">Fully insured</div>
              </div>
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">Business</div>
                <div className="text-lg font-medium tracking-tight">NCP Contracting LLC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="relative bg-neutral-950 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">Service area</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] mb-6 max-w-3xl">
            Based in Tampa Bay. Active across Pinellas and Hillsborough.
          </h2>
          <div className="flex flex-wrap gap-2 max-w-4xl">
            {CITIES.map((c) => (
              <span key={c} className="text-xs text-white/70 border border-white/15 px-3 py-1.5 rounded-full bg-white/[0.02]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Let's build"
        title="Ready to start your project?"
        primary={{ label: 'Get in touch', to: '/contact' }}
        secondary={{ label: 'See our work', to: '/projects' }}
      />
    </>
  )
}
