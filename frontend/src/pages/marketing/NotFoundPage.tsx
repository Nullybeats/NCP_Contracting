import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-8 text-center pt-32 pb-16">
      <div className="text-xs tracking-[0.4em] uppercase text-blue-400/80 mb-6">404</div>
      <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
        Page not found.
      </h1>
      <p className="text-base text-white/60 max-w-md mb-10">
        The page you were looking for doesn't exist here. Head home or check our recent work.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white text-sm tracking-[0.2em] uppercase px-6 py-3 rounded-sm transition"
        >
          Back home
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-3 border border-white/30 hover:border-white text-white text-sm tracking-[0.2em] uppercase px-6 py-3 rounded-sm transition"
        >
          See projects
        </Link>
      </div>
    </section>
  )
}
