import { useEffect, useState } from 'react'
import { Folder, FileSpreadsheet, FileText, File as FileIcon, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative, formatSize, getTemplates, type DriveItem } from '@/lib/onedrive'
import { PageHeader } from '@/components/PageHeader'
import { FilePreviewDialog } from '@/components/FilePreviewDialog'

function iconFor(item: DriveItem) {
  if (item.folder) return Folder
  const n = item.name.toLowerCase()
  if (n.match(/\.(xls|xlsx|xlsm|csv)$/)) return FileSpreadsheet
  if (n.match(/\.(pdf|docx?|txt)$/)) return FileText
  return FileIcon
}

export function TemplatesPage() {
  const [items, setItems] = useState<DriveItem[] | null>(null)
  const [error, setError] = useState('')
  const [previewing, setPreviewing] = useState<DriveItem | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await getTemplates()
        if (alive) setItems(data.value)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Source documents reused across every project. Edit in OneDrive — changes flow into new projects automatically."
      />
      <div className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!items && !error && (
        <div className="space-y-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      )}
      {items && items.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No templates yet.
          </CardContent>
        </Card>
      )}
      {items && items.length > 0 && (
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {items
              .slice()
              .sort((a, b) => Number(!!b.folder) - Number(!!a.folder) || a.name.localeCompare(b.name))
              .map((item) => {
                const Icon = iconFor(item)
                const isFolder = !!item.folder
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isFolder) {
                          if (item.webUrl) window.open(item.webUrl, '_blank', 'noreferrer')
                        } else {
                          setPreviewing(item)
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition text-left"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{item.name}</div>
                        {item.folder?.childCount != null && (
                          <div className="text-xs text-muted-foreground">{item.folder.childCount} items</div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatRelative(item.lastModifiedDateTime)}</span>
                      {!isFolder && (
                        <span className="text-xs text-muted-foreground w-16 text-right">{formatSize(item.size)}</span>
                      )}
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60" />
                    </button>
                  </li>
                )
              })}
          </ul>
        </Card>
      )}
      </div>
      <FilePreviewDialog item={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
