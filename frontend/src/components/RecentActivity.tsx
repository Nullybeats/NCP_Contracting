import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Folder, FileText, FileSpreadsheet, Image as ImageIcon, File as FileIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatRelative,
  getRecent,
  parseProjectPath,
  type RecentItem,
} from '@/lib/onedrive'

function iconFor(item: RecentItem) {
  if (item.folder) return Folder
  const n = item.name.toLowerCase()
  if (n.match(/\.(xls|xlsx|xlsm|csv)$/)) return FileSpreadsheet
  if (n.match(/\.(jpe?g|png|gif|webp|heic|tif?f)$/)) return ImageIcon
  if (n.match(/\.(pdf|docx?|txt)$/)) return FileText
  return FileIcon
}

export function RecentActivity() {
  const [items, setItems] = useState<RecentItem[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await getRecent(10)
        if (alive) setItems(data.value)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-3 py-2 border-b flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Activity className="h-3.5 w-3.5" />
        Recent activity
      </div>
      <div className="p-2 max-h-[300px] overflow-auto">
        {!items && !error && (
          <div className="space-y-1.5">
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
          </div>
        )}
        {error && <p className="text-xs text-destructive p-1">{error}</p>}
        {items && items.length === 0 && (
          <p className="text-xs text-muted-foreground p-2">No recent edits.</p>
        )}
        {items && items.length > 0 && (
          <ul className="space-y-0.5">
            {items.map((it) => {
              const Icon = iconFor(it)
              const { project, stage } = parseProjectPath(it.parentReference?.path)
              const inner = (
                <>
                  <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-foreground">{it.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {project ? `${project}${stage ? ` · ${stage}` : ''}` : 'OneDrive'}
                      {' · '}
                      {formatRelative(it.lastModifiedDateTime)}
                    </div>
                  </div>
                </>
              )
              const cls = 'flex items-start gap-2 px-2 py-1.5 rounded hover:bg-accent transition text-xs leading-tight'
              return (
                <li key={it.id}>
                  {project ? (
                    <Link to={`/dashboard/project/${encodeURIComponent(project)}`} className={cls}>{inner}</Link>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
