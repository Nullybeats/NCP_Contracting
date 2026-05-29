import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage'
import { ProjectPage } from '@/pages/dashboard/ProjectPage'
import { TemplatesPage } from '@/pages/dashboard/TemplatesPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ProjectsPage />} />
            <Route path="project/:name" element={<ProjectPage />} />
            <Route path="templates" element={<TemplatesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
