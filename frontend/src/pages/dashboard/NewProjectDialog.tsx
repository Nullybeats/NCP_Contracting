import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProject, getProjects } from '@/lib/onedrive'

const INVALID = /[\\/:*?"<>|]/

async function waitForProject(name: string, timeoutMs = 30_000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 1500))
    try {
      const { active } = await getProjects()
      if (active.some((p) => p.name === name)) return true
    } catch {
      // ignore transient errors during polling
    }
  }
  return false
}

type Props = {
  onCreated?: () => void
}

export function NewProjectDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const reset = () => { setName(''); setSubmitting(false) }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (INVALID.test(trimmed)) {
      toast.error('Name has invalid characters', { description: 'Avoid \\ / : * ? " < > |' })
      return
    }
    setSubmitting(true)
    try {
      await createProject(trimmed)
      setOpen(false)
      reset()
      const id = toast.loading(`Creating "${trimmed}"…`, { description: 'Copying the project folder template.' })
      const found = await waitForProject(trimmed)
      toast.dismiss(id)
      if (found) {
        toast.success(`Project "${trimmed}" created`)
        onCreated?.()
        navigate(`/dashboard/project/${encodeURIComponent(trimmed)}`)
      } else {
        toast.warning('Still copying — refresh in a moment')
        onCreated?.()
      }
    } catch (err) {
      toast.error('Could not create project', { description: String(err) })
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              This copies <span className="font-mono text-xs">09-Templates / Project Folder Template</span>{' '}
              into <span className="font-mono text-xs">01-Active Projects /</span> as a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              autoFocus
              placeholder="e.g. Smith Kitchen Remodel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
