import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Props = {
  onDone: () => void
  /** how long the logo stays visible before fading out (ms) */
  holdMs?: number
}

export function Loader({ onDone, holdMs = 2200 }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), holdMs)
    return () => window.clearTimeout(t)
  }, [holdMs])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <img
              src="/logo-transparent.png"
              alt="NCP Contracting"
              draggable={false}
              className="ncp-mask-reveal w-44 sm:w-56 md:w-64 select-none"
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '120%', opacity: [0, 0.55, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, rgba(96,165,250,0.45) 50%, transparent 70%)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
