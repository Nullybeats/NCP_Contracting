const NAME = 'Nicholas Pejack'
const ROLE = 'Owner · General Contractor'
const TO = 'contact@ncpbuild.com'
const PHONE_DISPLAY = '727-324-7699'
const PHONE_TEL = '+17273247699'
const INSTAGRAM = 'ncp_contractingllc'
const LICENSE = 'CGC1541048'
const LOCATION = 'Tampa Bay Area, Florida'

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
          Let&rsquo;s talk about your next project.
        </h2>
        <a
          href={`mailto:${TO}`}
          className="group mt-10 inline-flex items-baseline gap-4 text-2xl sm:text-3xl font-medium text-white hover:text-blue-400 transition"
        >
          {TO}
          <span className="block w-12 h-px bg-white/40 group-hover:bg-blue-400 group-hover:w-20 transition-all" />
        </a>

        <div className="mt-20 grid sm:grid-cols-3 gap-10 text-sm text-white/60">
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Office
            </div>
            <p className="text-white">{NAME}</p>
            <p>{ROLE}</p>
            <p className="mt-2">NCP Contracting LLC</p>
            <p>{LOCATION}</p>
          </div>
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Licensed &amp; Insured
            </div>
            <p>License #{LICENSE}</p>
            <p>Fully insured</p>
            <p className="mt-2">Residential · Commercial</p>
            <p>New Construction · Remodels</p>
          </div>
          <div>
            <div className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">
              Connect
            </div>
            <p>
              <a href={`tel:${PHONE_TEL}`} className="hover:text-white transition">
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <a href={`mailto:${TO}`} className="hover:text-white transition">
                {TO}
              </a>
            </p>
            <p>
              <a
                href={`https://instagram.com/${INSTAGRAM}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                @{INSTAGRAM}
              </a>
            </p>
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
