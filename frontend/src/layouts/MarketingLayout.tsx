import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export function MarketingLayout() {
  return (
    <div className="min-h-svh bg-neutral-950 text-white">
      <Nav />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
