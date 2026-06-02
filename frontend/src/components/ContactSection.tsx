import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, ArrowRight, Send, ShieldCheck } from 'lucide-react'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

const NAME = 'Nicholas Pejack'
const ROLE = 'Owner · General Contractor'
const TO = 'contact@ncpbuild.com'
const PHONE = '727-324-7699'
const PHONE_TEL = '+17273247699'
const INSTAGRAM = 'ncp_contractingllc'
const LICENSE = 'CGC1541048'
const LOCATION = 'Tampa Bay Area, Florida'

export function ContactSection() {
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHovered({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const phone = String(data.get('phone') ?? '')
    const project = String(data.get('project') ?? '')
    const message = String(data.get('message') ?? '')

    const subject = encodeURIComponent(`New inquiry — ${name || 'NCP website'}`)
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Project: ${project}`,
        '',
        message,
      ].join('\n'),
    )
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`
    window.setTimeout(() => setSubmitting(false), 1500)
  }

  return (
    <section
      id="contact"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHovered(null)}
      className="relative w-full bg-black text-white overflow-hidden py-24 sm:py-32"
    >
      {/* Animated grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Spotlight that follows mouse */}
      {hovered && (
        <div
          aria-hidden
          className="pointer-events-none absolute -z-0 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl transition-transform duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 80%)',
            left: hovered.x - 250,
            top: hovered.y - 250,
          }}
        />
      )}

      {/* Static ambient glow */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, #60a5fa 0deg, #f59e0b 180deg, #60a5fa 360deg)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/50">
            Get in touch
          </span>
          <h2 className="mt-3 font-serif text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Let&rsquo;s build something.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Tell us about your project. We&rsquo;ll get back to you within one business day.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Contact info column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                Direct contact
              </div>
              <div className="mt-1 text-lg font-medium tracking-tight">{NAME}</div>
              <div className="text-xs text-white/60">{ROLE}</div>
            </div>

            <InfoRow icon={Phone} label="Phone" value={PHONE} href={`tel:${PHONE_TEL}`} />
            <InfoRow icon={Mail} label="Email" value={TO} href={`mailto:${TO}`} />
            <InfoRow
              icon={InstagramIcon}
              label="Instagram"
              value={`@${INSTAGRAM}`}
              href={`https://instagram.com/${INSTAGRAM}`}
              external
            />
            <InfoRow icon={MapPin} label="Service area" value={LOCATION} />
            <InfoRow icon={ShieldCheck} label="Licensed & Insured" value={`#${LICENSE}`} />

            <div className="pt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">
              Built on trust. Delivered with quality.
            </div>
          </motion.div>

          {/* Form column */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Name" placeholder="Jane Smith" required />
              <Field name="email" type="email" label="Email" placeholder="jane@example.com" required />
              <Field name="phone" type="tel" label="Phone" placeholder="(555) 555-5555" />
              <Field name="project" label="Project type" placeholder="Renovation, addition, build…" />
            </div>
            <div className="mt-4">
              <label htmlFor="message" className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="What are you looking to build? Timeline, scope, anything we should know…"
                className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:border-white/40 sm:w-auto disabled:opacity-60"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(115deg, #60a5fa 0%, #ffffff 50%, #f59e0b 100%)',
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? 'Opening email…' : 'Send inquiry'}
                {submitting ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </span>
            </button>
            <p className="mt-3 text-[11px] text-white/40">
              Opens your email app pre-filled. Or just email {TO} directly.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          {label}
        </div>
        <div className="truncate text-sm text-white">{value}</div>
      </div>
    </div>
  )
  const cls = 'block rounded-xl border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-sm transition'
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={`${cls} hover:border-white/30 hover:bg-white/[0.05]`}
      >
        {inner}
      </a>
    )
  }
  return <div className={cls}>{inner}</div>
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  required,
}: {
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10"
      />
    </div>
  )
}
