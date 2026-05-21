import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

type Props = {
  id: string
  index: number
  total: number
  eyebrow: string
  title: string
  tagline: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  imageUrl?: string
  /** flip the image to the right side */
  reverse?: boolean
}

export function StorySection({
  id,
  index,
  total,
  eyebrow,
  title,
  tagline,
  body,
  ctaLabel = 'Discover more',
  ctaHref = '#',
  imageUrl,
  reverse = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section
      id={id}
      ref={ref}
      className="relative bg-neutral-950 text-white py-28 sm:py-40 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-10 w-px bg-white/10" />
      <div className="absolute inset-y-0 right-10 w-px bg-white/10" />

      <div className="relative max-w-6xl mx-auto px-8 sm:px-16">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* image / visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-sm"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500" />
            <div className="absolute bottom-0 left-0 text-xs tracking-[0.3em] uppercase text-white/60 p-4">
              {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          </motion.div>

          {/* text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: reverse ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xs sm:text-sm tracking-[0.4em] uppercase text-blue-400/80 mb-6"
            >
              {eyebrow}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 text-lg sm:text-xl text-white/80"
            >
              {tagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 text-white/60 leading-relaxed max-w-prose"
            >
              {body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <a
                href={ctaHref}
                className="group mt-10 inline-flex items-center gap-3 text-sm tracking-[0.3em] uppercase text-white/80 hover:text-blue-400 transition"
              >
                {ctaLabel}
                <span className="block w-12 h-px bg-white/30 group-hover:bg-blue-400 group-hover:w-20 transition-all" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
