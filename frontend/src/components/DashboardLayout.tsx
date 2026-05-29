import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FolderKanban, FileText, Users, Receipt, LogOut, ChevronsUpDown } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getMe, logout, UnauthenticatedError, type Me } from '@/lib/onedrive'

type NavItem = {
  to: string
  label: string
  icon: typeof FolderKanban
  match: (p: string) => boolean
  disabled?: boolean
}

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Projects', icon: FolderKanban, match: (p) => p === '/dashboard' || p.startsWith('/dashboard/project') },
  { to: '/dashboard/templates', label: 'Templates', icon: FileText, match: (p) => p === '/dashboard/templates' },
  { to: '/dashboard/subcontractors', label: 'Subcontractors', icon: Users, match: (p) => p === '/dashboard/subcontractors', disabled: true },
  { to: '/dashboard/receipts', label: 'Receipts', icon: Receipt, match: (p) => p === '/dashboard/receipts', disabled: true },
]

function ConnectGate() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-5 bg-background text-foreground p-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">NCP Dashboard</h1>
        <p className="text-sm text-muted-foreground">Connect Nicholas's OneDrive to continue.</p>
      </div>
      <a
        href="/api/auth/login"
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition"
      >
        Connect OneDrive
      </a>
    </div>
  )
}

function initialsOf(me: Me | null): string {
  const n = me?.displayName ?? me?.userPrincipalName ?? me?.mail ?? '?'
  return n
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || '?'
}

export function DashboardLayout() {
  const [me, setMe] = useState<Me | null>(null)
  const [status, setStatus] = useState<'loading' | 'unauthed' | 'ready' | 'error'>('loading')
  const [errorText, setErrorText] = useState('')
  const location = useLocation()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await getMe()
        if (!alive) return
        setMe(data)
        setStatus('ready')
      } catch (e) {
        if (!alive) return
        if (e instanceof UnauthenticatedError) {
          setStatus('unauthed')
        } else {
          setErrorText(String(e))
          setStatus('error')
        }
      }
    })()
    return () => { alive = false }
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-svh bg-background p-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-40 w-full max-w-2xl" />
      </div>
    )
  }
  if (status === 'unauthed') return <ConnectGate />
  if (status === 'error') {
    return (
      <div className="min-h-svh bg-background p-8 text-destructive">
        <h1 className="text-xl mb-4">Error</h1>
        <pre className="whitespace-pre-wrap text-sm">{errorText}</pre>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-sm">
              N
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold leading-tight">NCP Contracting</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Dashboard</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => {
                  const isActive = item.match(location.pathname)
                  const Icon = item.icon
                  if (item.disabled) {
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          tooltip={`${item.label} (coming soon)`}
                          disabled
                          className="opacity-50 cursor-not-allowed"
                        >
                          <Icon />
                          <span>{item.label}</span>
                          <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
                            Soon
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.to}><Icon /><span>{item.label}</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-medium">
                        {initialsOf(me)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{me?.displayName ?? 'Unknown'}</span>
                      <span className="truncate text-xs text-muted-foreground">{me?.userPrincipalName ?? me?.mail ?? ''}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Signed in</DropdownMenuLabel>
                  <DropdownMenuLabel className="pt-0">{me?.displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout()
                      window.location.reload()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-6 py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster richColors closeButton position="bottom-right" />
    </SidebarProvider>
    </TooltipProvider>
  )
}
