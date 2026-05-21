import { Button } from '@/components/ui/button'

export function Landing() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-semibold tracking-tight text-lg">
            NCP Contracting
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground">Services</a>
            <a href="#about" className="hover:text-foreground">About</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <Button asChild size="sm">
            <a href="#contact">Get a quote</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl">
            Built right. Built to last.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            NCP Contracting is a general contractor delivering quality
            residential and commercial work — from new builds to remodels and
            everything in between.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#contact">Request a quote</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#services">See our services</a>
            </Button>
          </div>
        </section>

        <section id="services" className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Services
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.title} className="rounded-lg border p-6">
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Start your project
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Tell us about the work. We'll get back to you with next steps.
            </p>
            <Button asChild size="lg" className="mt-8">
              <a href="mailto:hello@ncpbuild.com">Email us</a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} NCP Contracting</span>
          <span>ncpbuild.com</span>
        </div>
      </footer>
    </div>
  )
}

const SERVICES = [
  { title: 'New Construction', body: 'Ground-up residential and light commercial builds.' },
  { title: 'Remodels & Additions', body: 'Kitchens, baths, additions, and full-home renovations.' },
  { title: 'Decks & Exteriors', body: 'Decks, siding, and exterior finish work.' },
  { title: 'Concrete & Foundations', body: 'Footings, slabs, driveways, and foundation repair.' },
  { title: 'Project Management', body: 'We coordinate subs, permits, and timelines end-to-end.' },
  { title: 'Custom Carpentry', body: 'Built-ins, trim work, and finish carpentry.' },
]
