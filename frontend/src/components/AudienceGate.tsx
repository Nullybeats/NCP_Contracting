import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Hammer, Building2, ArrowRight } from 'lucide-react'

export type Audience = 'homeowner' | 'developer'

type Props = {
  onSelect: (audience: Audience) => void
}

type PanelProps = {
  id: Audience
  title: string
  eyebrow: string
  description: string
  imageUrl: string
  videoUrl?: string
  accent: string
  Icon: typeof Hammer
  hovered: Audience | null
  setHovered: (a: Audience | null) => void
  onSelect: (a: Audience) => void
  side: 'left' | 'right'
}

function Panel({
  id,
  title,
  eyebrow,
  description,
  imageUrl,
  videoUrl,
  accent,
  Icon,
  hovered,
  setHovered,
  onSelect,
  side,
}: PanelProps) {
  const isHovered = hovered === id
  const isDimmed = hovered !== null && !isHovered

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(id)}
      onBlur={() => setHovered(null)}
      onClick={() => onSelect(id)}
      className="group relative flex-1 overflow-hidden text-left focus:outline-none"
      animate={{ flexGrow: isHovered ? 1.35 : isDimmed ? 0.75 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background image / video */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={imageUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            side === 'left'
              ? 'linear-gradient(105deg, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.75) 100%)'
              : 'linear-gradient(255deg, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Accent wash on hover */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.35 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(circle at ${side === 'left' ? '30%' : '70%'} 60%, ${accent}, transparent 65%)`,
        }}
      />

      {/* Dim overlay when other side hovered */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDimmed ? 0.45 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex h-full w-full flex-col justify-end p-8 sm:p-12 md:p-16 ${
          side === 'left' ? 'items-start text-left' : 'items-end text-right'
        }`}
      >
        <motion.div
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-col gap-4 ${side === 'right' ? 'items-end' : 'items-start'}`}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 backdrop-blur-md"
            style={{ background: `${accent}22` }}
          >
            <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
            {eyebrow}
          </span>

          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h2>

          <p className="max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
            {description}
          </p>

          <motion.div
            className="mt-2 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white"
            animate={{ opacity: isHovered ? 1 : 0.6, x: isHovered ? 0 : side === 'right' ? 6 : -6 }}
            transition={{ duration: 0.4 }}
          >
            {side === 'right' && <ArrowRight className="h-4 w-4 rotate-180" />}
            <span>Enter</span>
            {side === 'left' && <ArrowRight className="h-4 w-4" />}
          </motion.div>
        </motion.div>
      </div>

      {/* Border between panels */}
      {side === 'left' && (
        <div className="absolute inset-y-0 right-0 z-20 hidden w-px bg-white/10 md:block" />
      )}
    </motion.button>
  )
}

export function AudienceGate({ onSelect }: Props) {
  const [hovered, setHovered] = useState<Audience | null>(null)
  const [visible, setVisible] = useState(true)

  const handlePick = (a: Audience) => {
    setVisible(false)
    window.setTimeout(() => onSelect(a), 650)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="audience-gate"
          className="fixed inset-0 z-40 bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
        >
          {/* Header */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 flex flex-col items-center gap-3 px-6 pt-8 text-center sm:pt-12"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/logo-transparent.png"
              alt="NCP Contracting"
              className="h-10 w-auto opacity-90 sm:h-12"
              draggable={false}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/50">
              Choose your path
            </span>
          </motion.div>

          {/* Panels */}
          <div className="flex h-full w-full flex-col md:flex-row">
            <Panel
              id="homeowner"
              side="left"
              eyebrow="For Homeowners"
              title="Build the home you live in."
              description="Renovations, additions, and finishes for the spaces you call home — guided by a team that communicates and finishes what we start."
              imageUrl="/projects/bath-01.png"
              accent="#60a5fa"
              Icon={Hammer}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={handlePick}
            />
            <Panel
              id="developer"
              side="right"
              eyebrow="For Developers"
              title="Build at the scale of your vision."
              description="Multi-unit, commercial, and ground-up construction delivered on schedule, on budget, and to the spec your investors expect."
              imageUrl="/projects/developer-hero.jpg"
              videoUrl="/projects/developer-hero.mp4"
              accent="#f59e0b"
              Icon={Building2}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={handlePick}
            />
          </div>

          {/* Footer hint */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-6 sm:pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              NCP Contracting · ncpbuild.com
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
