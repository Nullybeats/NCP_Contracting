import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/ThemeProvider'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProjectsPage as DashboardProjectsPage } from '@/pages/dashboard/ProjectsPage'
import { ProjectPage } from '@/pages/dashboard/ProjectPage'
import { TemplatesPage } from '@/pages/dashboard/TemplatesPage'
import { LeadsPage } from '@/pages/dashboard/LeadsPage'
import { ReceiptsPage } from '@/pages/dashboard/ReceiptsPage'
import { SubcontractorsPage as DashboardSubcontractorsPage } from '@/pages/dashboard/SubcontractorsPage'
import { ServicesPage } from '@/pages/marketing/ServicesPage'
import { ProjectsPage as MarketingProjectsPage } from '@/pages/marketing/ProjectsPage'
import { ProjectDetailPage } from '@/pages/marketing/ProjectDetailPage'
import { SubcontractorsPage as MarketingSubcontractorsPage } from '@/pages/marketing/SubcontractorsPage'
import { AboutPage } from '@/pages/marketing/AboutPage'
import { ContactPage } from '@/pages/marketing/ContactPage'
import { NotFoundPage } from '@/pages/marketing/NotFoundPage'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    element: <MarketingLayout />,
    children: [
      { path: '/services', element: <ServicesPage /> },
      { path: '/projects', element: <MarketingProjectsPage /> },
      { path: '/projects/:slug', element: <ProjectDetailPage /> },
      { path: '/subcontractors', element: <MarketingSubcontractorsPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardProjectsPage /> },
      { path: 'project/:name', element: <ProjectPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'subcontractors', element: <DashboardSubcontractorsPage /> },
      { path: 'receipts', element: <ReceiptsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
