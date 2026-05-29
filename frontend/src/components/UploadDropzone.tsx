import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, Camera, FilePlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadFile } from '@/lib/onedrive'

type Props = {
  folderPath: string
  onUploaded?: () => void
}

type Row = {
  id: string
  name: string
  size: number
  status: 'queued' | 'uploading' | 'done' | 'error'
  progress: number
  error?: string
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function UploadDropzone({ folderPath, onUploaded }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [rows, setRows] = useState<Row[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const startUpload = async (files: File[]) => {
    if (files.length === 0) return
    const newRows: Row[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      size: f.size,
      status: 'queued',
      progress: 0,
    }))
    setRows((prev) => [...newRows, ...prev])

    let okCount = 0
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const row = newRows[i]
      updateRow(row.id, { status: 'uploading' })
      try {
        await uploadFile(folderPath, file, (pct) => updateRow(row.id, { progress: pct }))
        updateRow(row.id, { status: 'done', progress: 100 })
        okCount++
      } catch (e) {
        updateRow(row.id, { status: 'error', error: String(e) })
      }
    }
    if (okCount > 0) {
      toast.success(`${okCount} file${okCount === 1 ? '' : 's'} uploaded`)
      onUploaded?.()
    }
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    startUpload(files)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files ?? [])
    startUpload(files)
  }

  const visibleRows = rows.slice(0, 6)
  const hiddenCount = rows.length - visibleRows.length

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-lg border-2 border-dashed p-4 flex items-center justify-between gap-3 transition ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
          <Upload className="h-5 w-5 shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Drop files here, or </span>
            <span className="sm:hidden">Add files to </span>
            <span className="font-medium text-foreground">{folderPath.split('/').slice(-2).join(' / ')}</span>
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <input ref={fileInputRef} type="file" multiple onChange={onPick} className="hidden" />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPick}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <FilePlus className="h-4 w-4 mr-1.5" />
            Add files
          </Button>
          <Button variant="outline" size="sm" onClick={() => cameraInputRef.current?.click()} className="sm:hidden">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {rows.length > 0 && (
        <ul className="space-y-1.5">
          {visibleRows.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 text-sm rounded-md border bg-card px-3 py-2"
            >
              {r.status === 'uploading' && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
              {r.status === 'queued' && <Loader2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
              {r.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
              {r.status === 'error' && <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />}
              <span className="flex-1 truncate">{r.name}</span>
              <span className="text-xs text-muted-foreground">{formatBytes(r.size)}</span>
              {r.status === 'uploading' && (
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${r.progress}%` }} />
                </div>
              )}
              {r.status === 'error' && (
                <span className="text-xs text-destructive truncate max-w-[180px]" title={r.error}>
                  {r.error}
                </span>
              )}
            </li>
          ))}
          {hiddenCount > 0 && (
            <li className="text-xs text-muted-foreground text-center">+{hiddenCount} more…</li>
          )}
        </ul>
      )}
    </div>
  )
}
