import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getProjectMeta, saveProjectMeta, PROJECT_STATUS_LABEL,
  type ProjectMeta, type ProjectStatus,
} from '@/lib/onedrive'

const STATUSES = Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]

type Props = {
  projectName: string
  initialMeta?: ProjectMeta
  onSaved?: (meta: ProjectMeta) => void
  trigger?: React.ReactNode
}

export function ProjectDetailsDialog({ projectName, initialMeta, onSaved, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [meta, setMeta] = useState<ProjectMeta>(initialMeta ?? {})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (initialMeta) return
    setLoading(true)
    getProjectMeta(projectName)
      .then((m) => setMeta(m))
      .catch(() => setMeta({}))
      .finally(() => setLoading(false))
  }, [open, projectName, initialMeta])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // strip empty strings → undefined
      const clean: ProjectMeta = {}
      for (const k of Object.keys(meta) as (keyof ProjectMeta)[]) {
        const v = meta[k]
        if (v == null || v === '') continue
        // @ts-expect-error narrowed mapping
        clean[k] = v
      }
      await saveProjectMeta(projectName, clean)
      toast.success('Project details saved')
      onSaved?.(clean)
      setOpen(false)
    } catch (err) {
      toast.error('Could not save', { description: String(err) })
    } finally {
      setSaving(false)
    }
  }

  const set = <K extends keyof ProjectMeta>(k: K, v: ProjectMeta[K]) =>
    setMeta((m) => ({ ...m, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Pencil className="mr-1.5 h-4 w-4" />
            Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Project details</DialogTitle>
            <DialogDescription>
              Saved as <span className="font-mono text-xs">_project.json</span> at the root of this project folder.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="py-6 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" value={meta.client ?? ''} onChange={(e) => set('client', e.target.value)} placeholder="Smith Family" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={meta.status ?? ''}
                    onChange={(e) => set('status', (e.target.value || undefined) as ProjectStatus)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                  >
                    <option value="">—</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={meta.address ?? ''} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St, Town, ST" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={meta.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 555-5555" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={meta.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="client@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="dollar">Amount ($)</Label>
                  <Input
                    id="dollar"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={meta.dollarAmount ?? ''}
                    onChange={(e) => set('dollarAmount', e.target.value === '' ? undefined : Number(e.target.value))}
                    placeholder="25000"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="start">Start</Label>
                  <Input id="start" type="date" value={meta.startDate ?? ''} onChange={(e) => set('startDate', e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="due">Due</Label>
                  <Input id="due" type="date" value={meta.dueDate ?? ''} onChange={(e) => set('dueDate', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={meta.notes ?? ''}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Anything worth remembering about this job…"
                  rows={3}
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs resize-y"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
