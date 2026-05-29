import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Folder, FileText, FileSpreadsheet, Image as ImageIcon, File as FileIcon, CheckCircle2, ChevronRight,
} from 'lucide-react'
import { imageSrcOf, previewKindOf } from '@/lib/onedrive'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  browsePath, completeProject, formatRelative, formatSize, getProject, moveFile,
  PROJECT_SUBFOLDERS, type DriveItem,
} from '@/lib/onedrive'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, FolderInput } from 'lucide-react'
import { UploadDropzone } from '@/components/UploadDropzone'
import { PageHeader } from '@/components/PageHeader'
import { FilePreviewDialog } from '@/components/FilePreviewDialog'

const SUBFOLDER_DESC: Record<string, string> = {
  '01-Contract': 'Signed agreement',
  '02-Estimate': 'Final budget',
  '03-Photos': 'Site progress photos',
  '04-Permits': 'Building permits',
  '05-Inspections': 'Inspection reports',
  '06-Sub Invoicing': 'Invoices from subs',
  '07-Change Orders': 'Mid-project scope changes',
  '08-Client Communication': 'Email / text archive',
  '09-Receipts': 'Material purchases',
  '10-Closeout': 'Final docs / warranty',
}

function fileIcon(item: DriveItem) {
  if (item.folder) return Folder
  const name = item.name.toLowerCase()
  if (name.match(/\.(xls|xlsx|xlsm|csv)$/)) return FileSpreadsheet
  if (name.match(/\.(jpe?g|png|gif|webp|heic|tiff?)$/)) return ImageIcon
  if (name.match(/\.(pdf|docx?|txt|rtf)$/)) return FileText
  return FileIcon
}

function SubfolderTile({
  name, subfolders, projectName, selected, onSelect,
}: {
  name: string
  subfolders: DriveItem[] | null
  projectName: string
  selected: boolean
  onSelect: (n: string) => void
}) {
  const meta = subfolders?.find((s) => s.name === name)
  const count = meta?.folder?.childCount
  return (
    <button
      onClick={() => onSelect(name)}
      className={`text-left rounded-lg border p-4 transition ${
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border hover:border-primary/50 hover:bg-accent'
      }`}
      data-project={projectName}
    >
      <div className="flex items-start justify-between mb-2">
        <Folder className={`h-5 w-5 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
        {count != null && (
          <span className="text-xs text-muted-foreground">{count}</span>
        )}
      </div>
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
        {SUBFOLDER_DESC[name] ?? ''}
      </div>
    </button>
  )
}

export function ProjectPage() {
  const { name = '' } = useParams<{ name: string }>()
  const projectName = decodeURIComponent(name)
  const navigate = useNavigate()
  const [subfolders, setSubfolders] = useState<DriveItem[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [nested, setNested] = useState<string[]>([])
  const [files, setFiles] = useState<DriveItem[] | null>(null)
  const [filesError, setFilesError] = useState('')
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [previewing, setPreviewing] = useState<DriveItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const currentFolderPath = selected
    ? ['NCP Contracting LLC', '01-Active Projects', projectName, selected, ...nested].join('/')
    : null

  useEffect(() => {
    let alive = true
    setError('')
    setSubfolders(null)
    setSelected(null)
    setFiles(null)
    setNested([])
    ;(async () => {
      try {
        const data = await getProject(projectName)
        if (alive) setSubfolders(data.value)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [projectName])

  useEffect(() => {
    if (!selected) return
    let alive = true
    setFilesError('')
    setFiles(null)
    const segments = ['NCP Contracting LLC', '01-Active Projects', projectName, selected, ...nested]
    ;(async () => {
      try {
        const data = await browsePath(segments.join('/'))
        if (alive) setFiles(data.value)
      } catch (e) {
        if (alive) setFilesError(String(e))
      }
    })()
    return () => { alive = false }
  }, [projectName, selected, nested, refreshKey])

  const doMove = async (file: DriveItem, toStage: string) => {
    const toPath = ['NCP Contracting LLC', '01-Active Projects', projectName, toStage].join('/')
    try {
      await moveFile(file.id, toPath)
      toast.success(`Moved "${file.name}" to ${toStage}`)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      toast.error('Could not move file', { description: String(e) })
    }
  }

  const doComplete = async () => {
    setCompleting(true)
    try {
      await completeProject(projectName)
      toast.success(`"${projectName}" marked complete`)
      navigate('/dashboard')
    } catch (e) {
      toast.error('Could not mark complete', { description: String(e) })
      setCompleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/dashboard">Projects</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate">{projectName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        title={projectName}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Mark complete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark "{projectName}" complete?</DialogTitle>
                <DialogDescription>
                  Moves the project folder from <span className="font-mono text-xs">01-Active Projects</span>{' '}
                  to <span className="font-mono text-xs">02-Completed Projects</span> in OneDrive.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" disabled={completing}>Cancel</Button>
                <Button onClick={doComplete} disabled={completing}>
                  {completing ? 'Moving…' : 'Mark complete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Stages
        </h2>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {PROJECT_SUBFOLDERS.map((sub) => (
            <SubfolderTile
              key={sub}
              name={sub}
              subfolders={subfolders}
              projectName={projectName}
              selected={selected === sub}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div>
          <div className="flex items-center gap-1 text-sm mb-3 flex-wrap">
            <button
              onClick={() => setNested([])}
              className="font-semibold uppercase tracking-wider text-xs text-muted-foreground hover:text-foreground"
            >
              {selected}
            </button>
            {nested.map((seg, i) => {
              const isLast = i === nested.length - 1
              return (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  {isLast ? (
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
              )
            })}
          </div>

          {currentFolderPath && (
            <div className="mb-4">
              <UploadDropzone
                folderPath={currentFolderPath}
                onUploaded={() => setRefreshKey((k) => k + 1)}
              />
            </div>
          )}

          {filesError && <p className="text-sm text-destructive">{filesError}</p>}
          {!files && !filesError && (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}
          {files && files.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Empty folder — nothing here yet.
              </CardContent>
            </Card>
          )}
          {files && files.length > 0 && (() => {
            const sorted = files.slice().sort((a, b) =>
              Number(!!b.folder) - Number(!!a.folder) || a.name.localeCompare(b.name),
            )
            const folders = sorted.filter((f) => f.folder)
            const items = sorted.filter((f) => !f.folder)
            const imageItems = items.filter((f) => previewKindOf(f) === 'image')
            const otherItems = items.filter((f) => previewKindOf(f) !== 'image')
            return (
              <div className="space-y-6">
                {(folders.length > 0 || otherItems.length > 0) && (
                  <Card className="overflow-hidden p-0">
                    <ul className="divide-y divide-border">
                      {[...folders, ...otherItems].map((f) => {
                        const Icon = fileIcon(f)
                        const isFolder = !!f.folder
                        return (
                          <li key={f.id} className="flex items-center hover:bg-accent transition group">
                            <button
                              type="button"
                              onClick={() => {
                                if (isFolder) setNested((p) => [...p, f.name])
                                else setPreviewing(f)
                              }}
                              className="flex-1 flex items-center gap-3 px-4 py-2.5 text-sm text-left min-w-0"
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${isFolder ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="flex-1 truncate">{f.name}</span>
                              {isFolder && f.folder?.childCount != null && (
                                <span className="text-xs text-muted-foreground">{f.folder.childCount} items</span>
                              )}
                              <span className="text-xs text-muted-foreground">{formatRelative(f.lastModifiedDateTime)}</span>
                              {!isFolder && (
                                <span className="text-xs text-muted-foreground w-16 text-right">{formatSize(f.size)}</span>
                              )}
                              {isFolder && <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60" />}
                            </button>
                            {!isFolder && nested.length === 0 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="File actions"
                                    className="px-2 py-2 mr-1 rounded-md text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    <FolderInput className="inline h-3 w-3 mr-1" />
                                    Move to stage
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {PROJECT_SUBFOLDERS.filter((s) => s !== selected).map((s) => (
                                    <DropdownMenuItem key={s} onClick={() => doMove(f, s)}>
                                      {s}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </Card>
                )}
                {imageItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Photos ({imageItems.length})
                    </h3>
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {imageItems.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setPreviewing(f)}
                          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:border-primary transition"
                        >
                          <img
                            src={imageSrcOf(f)}
                            alt={f.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition">
                            {f.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
      </div>
      <FilePreviewDialog item={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
