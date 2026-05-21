export function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-black text-white border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-16 py-24">
        <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">
          Get in touch
        </div>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] max-w-3xl">
          Let's talk about your next project.
        </h2>
        <a
          href="mailto:hello@ncpbuild.com"
          className="group mt-10 inline-flex items-baseline gap-4 text-2xl sm:text-3xl font-medium text-white hover:text-blue-400 transition"
        >
          hello@ncpbuild.com
          <span className="block w-12 h-px bg-white/40 group-hover:bg-blue-400 group-hover:w-20 transition-all" />
        </a>

        <div className="mt-20 grid sm:grid-cols-3 gap-10 text-sm text-white/60">
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Office
            </div>
            <p>NCP Contracting LLC</p>
            <p>Address line 1</p>
            <p>City, State ZIP</p>
          </div>
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Hours
            </div>
            <p>Mon – Fri</p>
            <p>7:00 AM – 6:00 PM</p>
          </div>
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Connect
            </div>
            <p>hello@ncpbuild.com</p>
            <p>(000) 000-0000</p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/40 tracking-[0.2em] uppercase">
          <span>© {new Date().getFullYear()} NCP Contracting LLC</span>
          <span>Built on trust. Delivered with quality.</span>
        </div>
      </div>
    </footer>
  )
}
