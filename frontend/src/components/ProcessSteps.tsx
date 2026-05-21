import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

const STEPS = [
  {
    title: 'Consultation',
    body: 'A site visit and a real conversation about your goals, budget, and timeline. No pressure, no canned pitch.',
  },
  {
    title: 'Estimate & Plan',
    body: 'A transparent, itemized estimate with a clear scope and schedule — so you know what you’re getting and when.',
  },
  {
    title: 'Build',
    body: 'We coordinate subs, permits, and inspections. Weekly progress updates, clean job sites, and your single point of contact throughout.',
  },
  {
    title: 'Walkthrough',
    body: 'We don’t leave until you’re happy. Punch list, final cleaning, and a sit-down to make sure everything is right.',
  },
]

export function ProcessSteps() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section
      id="process"
      ref={ref}
      className="relative bg-black text-white py-28 sm:py-40 border-y border-white/10"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm tracking-[0.4em] uppercase text-blue-400/80 mb-6"
        >
          Process
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-3xl"
        >
          Clear steps. Clear communication.
          <br />
          <span className="text-white/50">No surprises.</span>
        </motion.h2>

        <div className="mt-20 relative">
          {/* connector line */}
          <div className="absolute left-[18px] sm:left-[26px] top-2 bottom-2 w-px bg-white/10" />
          <ul className="space-y-12 sm:space-y-16">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="relative grid grid-cols-[auto_1fr] gap-6 sm:gap-12 items-start"
              >
                <div className="relative">
                  <div className="w-9 h-9 sm:w-[52px] sm:h-[52px] rounded-full bg-neutral-950 border border-blue-500/60 flex items-center justify-center text-blue-400 text-sm sm:text-base font-medium">
                    0{i + 1}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-white/60 max-w-2xl leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
