import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

type Ctx = {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme) => void
}

const STORAGE_KEY = 'ncp-theme'
const ThemeContext = createContext<Ctx | null>(null)

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(t: Theme): 'light' | 'dark' {
  const root = document.documentElement
  const resolved: 'light' | 'dark' = t === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : t
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
  return resolved
}

export function ThemeProvider({ children, defaultTheme = 'system' }: { children: ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? defaultTheme
  })
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => applyTheme(theme))

  useEffect(() => {
    setResolved(applyTheme(theme))
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolved(applyTheme('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
