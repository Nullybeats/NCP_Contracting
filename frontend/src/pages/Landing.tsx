import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { MarqueeStrip } from '@/components/MarqueeStrip'
import { StorySection } from '@/components/StorySection'
import { ServicesGrid } from '@/components/ServicesGrid'
import { ProcessSteps } from '@/components/ProcessSteps'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { StatsStrip } from '@/components/StatsStrip'
import { Footer } from '@/components/Footer'

export function Landing() {
  return (
    <div className="min-h-svh bg-neutral-950 text-white">
      <Nav />
      <Hero />
      <MarqueeStrip />

      <StorySection
        id="story"
        index={2}
        total={6}
        eyebrow="Our Story"
        title="Quality is more than a standard. It’s our attitude."
        tagline="Built on trust. Delivered with quality."
        body="NCP Contracting was founded on a simple idea: do excellent work and treat people right. Today we build for homeowners and businesses who want a contractor that shows up, communicates, and finishes what they start."
        ctaLabel="About us"
        ctaHref="#about"
        imageUrl="/projects/bath-01.png"
      />

      <ServicesGrid />
      <ProcessSteps />
      <ProjectsGrid />
      <StatsStrip />
      <Footer />
    </div>
  )
}
