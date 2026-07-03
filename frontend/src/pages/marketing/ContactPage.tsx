import { PageHero } from '@/components/marketing/PageHero'
import { ContactSection } from '@/components/ContactSection'
import { useSeo } from '@/lib/useSeo'

export function ContactPage() {
  useSeo({
    title: 'Contact',
    description:
      'Get in touch with NCP Contracting. Nicholas Pejack, owner. 727-324-7699. contact@ncpbuild.com. Tampa Bay, Florida.',
    path: '/contact',
  })
  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Get In Touch"
        title={<>Let&rsquo;s build something.</>}
        intro="Tell us about your project — scope, timeline, budget, and anything else worth knowing. We reply within one business day."
      />
      <ContactSection />
    </>
  )
}
