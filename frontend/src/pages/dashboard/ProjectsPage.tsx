import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Folder, FolderCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getProjects, formatRelative, type DriveItem } from '@/lib/onedrive'
import { PageHeader } from '@/components/PageHeader'
import { NewProjectDialog } from './NewProjectDialog'

function ProjectCard({ item, completed }: { item: DriveItem; completed?: boolean }) {
  const Icon = completed ? FolderCheck : Folder
  return (
    <Link to={`/dashboard/project/${encodeURIComponent(item.name)}`}>
      <Card className="h-full transition hover:border-primary/50 hover:shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon className={`h-4 w-4 shrink-0 ${completed ? 'text-muted-foreground' : 'text-primary'}`} />
              <CardTitle className="text-base truncate">{item.name}</CardTitle>
            </div>
            {completed && <Badge variant="secondary" className="shrink-0">Completed</Badge>}
          </div>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
          <span>{item.folder?.childCount ?? 0} folders</span>
          <span>Updated {formatRelative(item.lastModifiedDateTime)}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ProjectsPage() {
  const [active, setActive] = useState<DriveItem[] | null>(null)
  const [completed, setCompleted] = useState<DriveItem[] | null>(null)
  const [error, setError] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let alive = true
    setError('')
    ;(async () => {
      try {
        const data = await getProjects()
        if (!alive) return
        setActive(data.active)
        setCompleted(data.completed)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [refreshKey])

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Jobs in flight and ones already buttoned up."
        actions={<NewProjectDialog onCreated={() => setRefreshKey((k) => k + 1)} />}
      />
      <div className="space-y-8">

      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active</h2>
          {active && <Badge variant="secondary">{active.length}</Badge>}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!active && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}
        {active && active.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No active projects yet. Create one to get started.
            </CardContent>
          </Card>
        )}
        {active && active.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((p) => <ProjectCard key={p.id} item={p} />)}
          </div>
        )}
      </section>

      <section>
        <button
          onClick={() => setShowCompleted((s) => !s)}
          className="flex items-center gap-2 mb-3 group"
        >
          {showCompleted ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            Completed
          </h2>
          {completed && <Badge variant="outline">{completed.length}</Badge>}
        </button>
        {showCompleted && (
          <>
            {!completed && <Skeleton className="h-28" />}
            {completed && completed.length === 0 && (
              <p className="text-sm text-muted-foreground">No completed projects yet.</p>
            )}
            {completed && completed.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {completed
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => <ProjectCard key={p.id} item={p} completed />)}
              </div>
            )}
          </>
        )}
      </section>
      </div>
    </div>
  )
}
