import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { MarqueeStrip } from '@/components/MarqueeStrip'
import { StorySection } from '@/components/StorySection'
import { ServicesGrid } from '@/components/ServicesGrid'
import { ProcessSteps } from '@/components/ProcessSteps'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { StatsStrip } from '@/components/StatsStrip'
import { Footer } from '@/components/Footer'
import type { Audience } from '@/components/AudienceGate'

const COMMERCIAL_STORY = {
  eyebrow: 'Single-Source Delivery',
  title: 'One contractor. Every trade. Owned to closeout.',
  tagline: 'Built on trust. Delivered with quality.',
  body:
    'NCP Contracting acts as a turnkey GC for commercial owners and developers — managing every trade under one roof, from preconstruction through punch list. Multi-faceted execution, single point of accountability, predictable schedules.',
  ctaLabel: 'About us',
  ctaHref: '#about',
  imageUrl: '/projects/developer-hero.jpg',
} as const

const RESIDENTIAL_STORY = {
  eyebrow: 'Our Story',
  title: 'Quality is more than a standard. It’s our attitude.',
  tagline: 'Built on trust. Delivered with quality.',
  body:
    'NCP Contracting was founded on a simple idea: do excellent work and treat people right. Today we build for homeowners and businesses who want a contractor that shows up, communicates, and finishes what they start.',
  ctaLabel: 'About us',
  ctaHref: '#about',
  imageUrl: '/projects/bath-01.png',
} as const

export function Landing({ audience }: { audience: Audience }) {
  const story = audience === 'developer' ? COMMERCIAL_STORY : RESIDENTIAL_STORY
  return (
    <div className="min-h-svh bg-neutral-950 text-white">
      <Nav />
      <Hero audience={audience} />
      <MarqueeStrip audience={audience} />

      <StorySection
        id="story"
        index={2}
        total={6}
        eyebrow={story.eyebrow}
        title={story.title}
        tagline={story.tagline}
        body={story.body}
        ctaLabel={story.ctaLabel}
        ctaHref={story.ctaHref}
        imageUrl={story.imageUrl}
      />

      <ServicesGrid audience={audience} />
      <ProcessSteps audience={audience} />
      <ProjectsGrid />
      <StatsStrip />
      <Footer />
    </div>
  )
}
