import { useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import {
  Briefcase, Wallet, ClipboardCheck, Layers, Users, Handshake, ShieldCheck, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { PageHero } from '@/components/marketing/PageHero'
import { CtaBand } from '@/components/marketing/CtaBand'
import { useSeo } from '@/lib/useSeo'

const BENEFITS = [
  { icon: Briefcase, title: 'Steady work', body: 'Active pipeline of residential and commercial jobs across Tampa Bay.' },
  { icon: Wallet, title: 'Fair, on-time pay', body: 'Weekly draw schedules, transparent AIA-style billing, no games on invoices.' },
  { icon: ClipboardCheck, title: 'Professional management', body: 'Real project management, weekly OAC meetings, RFI + submittal tracking.' },
  { icon: Layers, title: 'Project variety', body: 'Buildouts, remodels, ground-up, TI — full-scope work, not one-off punchlists.' },
  { icon: Users, title: 'Vetted trades', body: 'You work alongside quality subs. We hold every trade to the same standard.' },
  { icon: Handshake, title: 'Long-term partnership', body: 'Once you\'re on our roster and delivering, we come back to you first.' },
]

const TRADES = [
  'Framing', 'Drywall', 'Paint', 'Electrical', 'Plumbing', 'HVAC',
  'Concrete', 'Roofing', 'Windows & Doors', 'Cabinetry', 'Countertops',
  'Flooring', 'Tile', 'Landscaping', 'Fencing', 'Pool & Spa', 'Demo & Haul-off',
]

const INSURANCE = [
  'Workers\' compensation coverage per Florida statute',
  'General liability — $1M per occurrence, $2M aggregate',
  'Automobile liability — $1M combined single limit',
  'NCP Contracting LLC listed as Additional Insured',
  'Certificate of Insurance (COI) required before mobilization',
]

type FormState = {
  company: string
  contact: string
  email: string
  phone: string
  primaryTrade: string
  license: string
  insuranceCarrier: string
  yearsInBusiness: string
  crewSize: string
  references: string
  notes: string
}

const EMPTY: FormState = {
  company: '', contact: '', email: '', phone: '', primaryTrade: '',
  license: '', insuranceCarrier: '', yearsInBusiness: '', crewSize: '',
  references: '', notes: '',
}

export function SubcontractorsPage() {
  useSeo({
    title: 'Subcontractors',
    description:
      'Partner with NCP Contracting. Steady work across Tampa Bay, fair on-time pay, professional project management. Submit your registration below.',
    path: '/subcontractors',
  })
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const inView = useInView(formRef, { once: true, margin: '-15% 0px' })

  const set = <K extends keyof FormState>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const mailtoFallback = () => {
    const body = Object.entries(form)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    const subject = encodeURIComponent(`Subcontractor application — ${form.company}`)
    window.location.href = `mailto:contact@ncpbuild.com?subject=${subject}&body=${encodeURIComponent(body)}`
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')
    try {
      const res = await fetch('/api/subcontractor/apply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('ok')
        setMessage('Application received. We\'ll be in touch within a few business days.')
        setForm(EMPTY)
        return
      }
      if (res.status === 503) {
        // Backend not authorized — mailto fallback
        setStatus('idle')
        setMessage('')
        mailtoFallback()
        return
      }
      throw new Error(`Server error: ${res.status}`)
    } catch (err) {
      setStatus('error')
      setMessage(`Couldn't submit online — opening your email app instead.`)
      window.setTimeout(mailtoFallback, 800)
    }
  }

  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Subcontractors' }]}
        eyebrow="Partner With Us"
        title={<>Work with NCP.<br /><span className="text-white/60">Steady jobs, fair terms.</span></>}
        intro="We're always looking for reliable trade partners across Tampa Bay. Submit your info below — we'll reach out when there's a good fit."
      />

      {/* Benefits */}
      <section className="relative bg-neutral-950 py-20 sm:py-28 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          <div className="mb-12">
            <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-4">Why partner with us</div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-3xl">
              Real work. Real pay. Real management.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
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

      {/* Trades chip cloud */}
      <section className="relative bg-black py-16 sm:py-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">Trades we hire</div>
          <div className="flex flex-wrap gap-2">
            {TRADES.map((t) => (
              <span
                key={t}
                className="text-xs sm:text-sm tracking-[0.1em] text-white/70 border border-white/15 px-3 py-1.5 rounded-full bg-white/[0.02] hover:border-white/40 hover:text-white transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance + Form */}
      <section ref={formRef} className="relative bg-neutral-950 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-8 sm:px-16 grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">Insurance requirements</div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
              <ShieldCheck className="h-6 w-6 text-blue-400 mb-4" strokeWidth={1.5} />
              <ul className="space-y-3 text-sm text-white/70">
                {INSURANCE.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/50 leading-relaxed">
                Once you're approved, we'll request your Certificate of Insurance and W-9 before your first mobilization.
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">Registration</div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              onSubmit={onSubmit}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4"
            >
              {status === 'ok' && (
                <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-200">{message}</div>
                </div>
              )}
              {status === 'error' && (
                <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-200">{message}</div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <SubField required label="Company" value={form.company} onChange={(v) => set('company', v)} placeholder="Acme Trades LLC" />
                <SubField required label="Contact name" value={form.contact} onChange={(v) => set('contact', v)} placeholder="Jane Smith" />
                <SubField required type="email" label="Email" value={form.email} onChange={(v) => set('email', v)} placeholder="jane@acme.com" />
                <SubField type="tel" label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 555-5555" />
                <SubField label="Primary trade" value={form.primaryTrade} onChange={(v) => set('primaryTrade', v)} placeholder="Framing, Drywall, MEP..." />
                <SubField label="License #" value={form.license} onChange={(v) => set('license', v)} placeholder="If applicable" />
                <SubField label="Insurance carrier" value={form.insuranceCarrier} onChange={(v) => set('insuranceCarrier', v)} placeholder="Carrier name" />
                <div className="grid grid-cols-2 gap-4">
                  <SubField type="number" label="Years in biz" value={form.yearsInBusiness} onChange={(v) => set('yearsInBusiness', v)} placeholder="10" />
                  <SubField type="number" label="Avg crew" value={form.crewSize} onChange={(v) => set('crewSize', v)} placeholder="4" />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5 block">References</label>
                <textarea
                  rows={2}
                  value={form.references}
                  onChange={(e) => set('references', e.target.value)}
                  placeholder="Name / phone or email — 2 or 3 references"
                  className="w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5 block">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Regions you cover, crew capacity, or anything else worth knowing…"
                  className="w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm tracking-[0.2em] uppercase px-7 py-3.5 rounded-sm transition disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit application'}
              </button>
              <p className="text-[11px] text-white/40">
                Or email <a className="underline hover:text-white" href="mailto:contact@ncpbuild.com">contact@ncpbuild.com</a> directly.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Questions?"
        title="We hire trades who show up and do the work."
        primary={{ label: 'Get in touch', to: '/contact' }}
      />
    </>
  )
}

function SubField({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
      />
    </div>
  )
}
