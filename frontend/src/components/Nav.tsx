import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="flex items-center justify-between px-6 sm:px-10 h-20">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src="/logo-transparent.png"
              alt="NCP Contracting"
              className="h-10 w-10 sm:h-11 sm:w-11"
            />
            <span className="hidden sm:inline text-sm tracking-[0.2em] text-white/90 uppercase">
              NCP Contracting
            </span>
          </a>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 grid place-items-center w-12 h-12 -mr-2 text-white"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block w-7 h-4">
              <motion.span
                className="absolute left-0 right-0 h-px bg-white origin-center"
                animate={open ? { top: '50%', rotate: 45 } : { top: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute left-0 right-0 h-px bg-white"
                style={{ top: '50%' }}
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 right-0 h-px bg-white origin-center"
                animate={open ? { top: '50%', rotate: -45 } : { top: '100%', rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="overlay"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-neutral-950"
          >
            <div className="relative h-full flex flex-col">
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background:radial-gradient(circle_at_70%_30%,#3b82f6,transparent_60%)]" />

              <ul className="flex-1 flex flex-col justify-center gap-2 sm:gap-4 px-8 sm:px-16">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.5,
                      ease: 'easeOut',
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group inline-flex items-baseline gap-4 text-5xl sm:text-7xl font-semibold tracking-tight text-white/90 hover:text-white transition"
                    >
                      <span className="text-xs sm:text-sm tracking-[0.3em] text-blue-500/70">
                        0{i + 1}
                      </span>
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-1 h-px w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-8 sm:px-16 pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-sm text-white/60"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="text-white text-base tracking-[0.2em] uppercase hover:text-blue-400 transition"
                >
                  Get a quote →
                </a>
                <div className="text-xs tracking-[0.2em] uppercase">
                  ncpbuild.com
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
