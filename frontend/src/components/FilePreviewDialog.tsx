import { useEffect, useState } from 'react'
import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  downloadUrlOf,
  formatRelative,
  formatSize,
  imageSrcOf,
  previewKindOf,
  type DriveItem,
} from '@/lib/onedrive'

type Props = {
  item: DriveItem | null
  onOpenChange: (open: boolean) => void
}

function CsvTable({ url }: { url: string }) {
  const [rows, setRows] = useState<string[][] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setRows(null)
    setError('')
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`fetch ${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (!alive) return
        // Minimal CSV parser: handles quoted cells with commas + escaped quotes
        const parsed: string[][] = []
        let row: string[] = []
        let cell = ''
        let inQ = false
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (inQ) {
            if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
            else if (ch === '"') { inQ = false }
            else { cell += ch }
          } else if (ch === '"') { inQ = true }
          else if (ch === ',') { row.push(cell); cell = '' }
          else if (ch === '\n') { row.push(cell); parsed.push(row); row = []; cell = '' }
          else if (ch === '\r') { /* skip */ }
          else { cell += ch }
        }
        if (cell.length || row.length) { row.push(cell); parsed.push(row) }
        setRows(parsed.filter((r) => r.some((c) => c !== '')))
      })
      .catch((e) => alive && setError(String(e)))
    return () => { alive = false }
  }, [url])

  if (error) return <p className="text-sm text-destructive p-4">{error}</p>
  if (!rows) return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" />
    </div>
  )
  if (rows.length === 0) return <p className="text-sm text-muted-foreground p-4">Empty CSV.</p>
  const [header, ...body] = rows
  return (
    <div className="overflow-auto max-h-[70vh] border-t">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-muted">
          <tr>
            {header.map((h, i) => (
              <th key={i} className="text-left font-medium px-3 py-2 border-b">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.slice(0, 500).map((r, i) => (
            <tr key={i} className="even:bg-muted/30">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-1.5 border-b border-border/50 align-top">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {body.length > 500 && (
        <p className="text-xs text-muted-foreground p-3">Showing first 500 of {body.length} rows.</p>
      )}
    </div>
  )
}

function TextPreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setText(null)
    setError('')
    fetch(url)
      .then((r) => r.ok ? r.text() : Promise.reject(new Error(`fetch ${r.status}`)))
      .then((t) => alive && setText(t))
      .catch((e) => alive && setError(String(e)))
    return () => { alive = false }
  }, [url])

  if (error) return <p className="text-sm text-destructive p-4">{error}</p>
  if (text == null) return (
    <div className="p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
  )
  return (
    <pre className="whitespace-pre-wrap font-mono text-xs p-4 max-h-[70vh] overflow-auto bg-muted/30 border-t">
      {text}
    </pre>
  )
}

function PreviewBody({ item }: { item: DriveItem }) {
  const kind = previewKindOf(item)
  const url = downloadUrlOf(item)

  if (!url) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Preview URL unavailable.
      </div>
    )
  }

  switch (kind) {
    case 'image': {
      const imgSrc = imageSrcOf(item) ?? url
      return (
        <div className="flex items-center justify-center bg-muted/30 max-h-[75vh] overflow-auto border-t">
          <img src={imgSrc} alt={item.name} className="max-h-[75vh] w-auto" />
        </div>
      )
    }
    case 'pdf':
      return (
        <iframe
          src={url}
          title={item.name}
          className="w-full h-[75vh] border-t bg-muted"
        />
      )
    case 'video':
      return (
        <div className="bg-black border-t">
          <video src={url} controls className="w-full max-h-[75vh]" />
        </div>
      )
    case 'audio':
      return (
        <div className="p-6 border-t">
          <audio src={url} controls className="w-full" />
        </div>
      )
    case 'csv':
      return <CsvTable url={url} />
    case 'text':
      return <TextPreview url={url} />
    case 'office':
      return (
        <div className="p-8 text-center space-y-3 border-t">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            Office documents preview best in OneDrive.
          </p>
          {item.webUrl && (
            <Button asChild>
              <a href={item.webUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Open in OneDrive
              </a>
            </Button>
          )}
        </div>
      )
    default:
      return (
        <div className="p-8 text-center space-y-3 border-t">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            No inline preview for this file type.
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <a href={url} download={item.name}>
                <Download className="mr-1.5 h-4 w-4" />
                Download
              </a>
            </Button>
            {item.webUrl && (
              <Button variant="outline" asChild>
                <a href={item.webUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Open in OneDrive
                </a>
              </Button>
            )}
          </div>
        </div>
      )
  }
}

export function FilePreviewDialog({ item, onOpenChange }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl p-0 gap-0 overflow-hidden"
        showCloseButton
      >
        {item && (
          <>
            <DialogHeader className="p-4 pb-3 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="truncate text-base">{item.name}</DialogTitle>
                  <DialogDescription className="text-xs">
                    {[formatSize(item.size), formatRelative(item.lastModifiedDateTime)]
                      .filter(Boolean).join(' • ')}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {downloadUrlOf(item) && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={downloadUrlOf(item)} download={item.name}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {item.webUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.webUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>
            <PreviewBody item={item} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
