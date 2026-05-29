import { useEffect, useState } from 'react'
import { Folder, FileText, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { FilePreviewDialog } from '@/components/FilePreviewDialog'
import { NewProjectDialog } from './NewProjectDialog'
import { formatRelative, getLeads, type DriveItem } from '@/lib/onedrive'

export function LeadsPage() {
  const [items, setItems] = useState<DriveItem[] | null>(null)
  const [error, setError] = useState('')
  const [previewing, setPreviewing] = useState<DriveItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let alive = true
    setError('')
    setItems(null)
    ;(async () => {
      try {
        const data = await getLeads()
        if (alive) setItems(data.value)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [refreshKey])

  return (
    <div>
      <PageHeader
        title="Estimates & Proposals"
        description="Pre-active leads. Convert one to an active project when the estimate is approved."
        actions={<NewProjectDialog onCreated={() => setRefreshKey((k) => k + 1)} />}
      />

      <div className="space-y-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!items && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        )}
        {items && items.length === 0 && (
          <Card>
            <CardContent className="py-14 flex flex-col items-center gap-3 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">No leads yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drop estimates or proposals into <span className="font-mono">03-Estimates &amp; Proposals</span> in OneDrive.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://onedrive.live.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open OneDrive
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
        {items && items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => {
                const isFolder = !!item.folder
                const Icon = isFolder ? Folder : FileText
                return (
                  <button
                    key={item.id}
                    onClick={() => isFolder ? item.webUrl && window.open(item.webUrl, '_blank') : setPreviewing(item)}
                    className="text-left rounded-lg border bg-card p-4 hover:border-primary/50 transition group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Icon className={`h-5 w-5 ${isFolder ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Badge variant="outline" className="text-[10px]">{isFolder ? 'Folder' : 'Doc'}</Badge>
                    </div>
                    <div className="font-medium text-sm truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Updated {formatRelative(item.lastModifiedDateTime)}
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>
      <FilePreviewDialog item={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
