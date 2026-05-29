import { useEffect, useState } from 'react'
import { ChevronRight, Folder, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { UploadDropzone } from '@/components/UploadDropzone'
import { FilePreviewDialog } from '@/components/FilePreviewDialog'
import { formatRelative, formatSize, getReceipts, type DriveItem } from '@/lib/onedrive'

const ROOT_PATH = 'NCP Contracting LLC/07-Accounting/Receipts'

export function ReceiptsPage() {
  const [nested, setNested] = useState<string[]>([])
  const [items, setItems] = useState<DriveItem[] | null>(null)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [previewing, setPreviewing] = useState<DriveItem | null>(null)

  const folderPath = nested.length ? `${ROOT_PATH}/${nested.join('/')}` : ROOT_PATH

  useEffect(() => {
    let alive = true
    setItems(null)
    setError('')
    ;(async () => {
      try {
        const data = await getReceipts(nested.length ? nested.join('/') : undefined)
        if (alive) setItems(data.value)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [nested, refreshKey])

  const totalSize = items?.reduce((sum, i) => sum + (i.size ?? 0), 0) ?? 0

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Material purchases and reimbursables, filed by year and month."
        actions={
          nested.length > 0 ? (
            <Button variant="outline" onClick={() => setNested([])} size="sm">
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              All
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6">
        {nested.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setNested([])}
              className="font-semibold uppercase tracking-wider text-xs text-muted-foreground hover:text-foreground"
            >
              Receipts
            </button>
            {nested.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                {i === nested.length - 1 ? (
                  <span className="text-foreground font-medium">{seg}</span>
                ) : (
                  <button
                    onClick={() => setNested((p) => p.slice(0, i + 1))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {seg}
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {nested.length >= 2 && (
          <UploadDropzone folderPath={folderPath} onUploaded={() => setRefreshKey((k) => k + 1)} />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {!items && !error && (
          <div className="space-y-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        )}
        {items && items.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {nested.length >= 2 ? 'No receipts yet.' : 'Nothing here.'}
            </CardContent>
          </Card>
        )}

        {items && items.length > 0 && (() => {
          const folders = items.filter((i) => i.folder)
          const files = items.filter((i) => !i.folder)
          return (
            <div className="space-y-6">
              {folders.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {folders
                    .slice()
                    .sort((a, b) => b.name.localeCompare(a.name))
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setNested((p) => [...p, f.name])}
                        className="text-left rounded-lg border bg-card p-4 hover:border-primary/50 hover:bg-accent transition"
                      >
                        <div className="flex items-center justify-between">
                          <Folder className="h-5 w-5 text-primary" />
                          {f.folder?.childCount != null && (
                            <Badge variant="secondary">{f.folder.childCount}</Badge>
                          )}
                        </div>
                        <div className="mt-2 font-medium text-sm">{f.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Updated {formatRelative(f.lastModifiedDateTime)}
                        </div>
                      </button>
                    ))}
                </div>
              )}
              {files.length > 0 && (
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {files.length} receipt{files.length === 1 ? '' : 's'}
                    </h3>
                    <span className="text-xs text-muted-foreground">{formatSize(totalSize)} total</span>
                  </div>
                  <Card className="overflow-hidden p-0">
                    <ul className="divide-y divide-border">
                      {files
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((f) => (
                          <li key={f.id}>
                            <button
                              onClick={() => setPreviewing(f)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition text-left"
                            >
                              <span className="flex-1 truncate">{f.name}</span>
                              <span className="text-xs text-muted-foreground">{formatRelative(f.lastModifiedDateTime)}</span>
                              <span className="text-xs text-muted-foreground w-16 text-right">{formatSize(f.size)}</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          )
        })()}
      </div>
      <FilePreviewDialog item={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
