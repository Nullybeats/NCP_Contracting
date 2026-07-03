import { PageHero } from '@/components/marketing/PageHero'
import { ContactSection } from '@/components/ContactSection'

export function ContactPage() {
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
