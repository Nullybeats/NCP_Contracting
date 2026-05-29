export type Me = {
  displayName?: string
  userPrincipalName?: string
  mail?: string
}

export type DriveItem = {
  id: string
  name: string
  size?: number
  webUrl?: string
  lastModifiedDateTime?: string
  folder?: { childCount?: number }
  file?: { mimeType?: string }
  '@microsoft.graph.downloadUrl'?: string
}

export function downloadUrlOf(item: DriveItem): string | undefined {
  return item['@microsoft.graph.downloadUrl']
}

export function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

export type PreviewKind = 'image' | 'pdf' | 'text' | 'csv' | 'office' | 'video' | 'audio' | 'unknown'

export function previewKindOf(item: DriveItem): PreviewKind {
  if (item.folder) return 'unknown'
  const ext = extOf(item.name)
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'tif', 'tiff', 'bmp', 'svg'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (ext === 'csv') return 'csv'
  if (['txt', 'md', 'log', 'json', 'xml', 'yaml', 'yml'].includes(ext)) return 'text'
  if (['xls', 'xlsx', 'xlsm', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) return 'office'
  if (['mp4', 'mov', 'webm', 'm4v'].includes(ext)) return 'video'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac'].includes(ext)) return 'audio'
  return 'unknown'
}

export type ProjectsResponse = {
  active: DriveItem[]
  completed: DriveItem[]
}

export function formatSize(bytes?: number): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function formatRelative(iso?: string): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}

async function jget<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' })
  if (res.status === 401) throw new UnauthenticatedError()
  if (!res.ok) throw new Error(`${url} ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export class UnauthenticatedError extends Error {
  constructor() { super('unauthenticated') }
}

export const getMe = () => jget<Me>('/api/graph/me')
export const getProjects = () => jget<ProjectsResponse>('/api/graph/projects')
export const getProject = (name: string) =>
  jget<{ value: DriveItem[] }>(`/api/graph/project/${encodeURIComponent(name)}`)
export const getProjectFolder = (name: string, sub: string) =>
  jget<{ value: DriveItem[] }>(
    `/api/graph/project/${encodeURIComponent(name)}/folder/${encodeURIComponent(sub)}`,
  )
export const browsePath = (path: string) =>
  jget<{ value: DriveItem[] }>(`/api/graph/files?path=${encodeURIComponent(path)}`)

export const thumbnailUrl = (id: string, size: 'small' | 'medium' | 'large' = 'large') =>
  `/api/graph/file/${encodeURIComponent(id)}/thumbnail?size=${size}`

const BROWSER_IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])

export function imageSrcOf(item: DriveItem, prefer: 'thumb' | 'original' = 'thumb'): string | undefined {
  const ext = extOf(item.name)
  const browserOk = BROWSER_IMAGE_EXTS.has(ext)
  if (prefer === 'thumb' || !browserOk) return thumbnailUrl(item.id, 'large')
  return downloadUrlOf(item) ?? thumbnailUrl(item.id, 'large')
}
export const getTemplates = () => jget<{ value: DriveItem[] }>('/api/graph/templates')

export async function createProject(name: string): Promise<void> {
  const res = await fetch('/api/graph/project', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok && res.status !== 202) {
    throw new Error(`createProject ${res.status}: ${await res.text()}`)
  }
}

export async function completeProject(name: string): Promise<void> {
  const res = await fetch(`/api/graph/project/${encodeURIComponent(name)}/complete`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`completeProject ${res.status}: ${await res.text()}`)
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}

type UploadSession = { uploadUrl: string; expirationDateTime?: string }

const CHUNK_BYTES = 8 * 1024 * 1024 // 8 MiB, must be multiple of 320 KiB

export async function uploadFile(
  folderPath: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<DriveItem> {
  const sessionRes = await fetch('/api/graph/upload-session', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: folderPath, name: file.name }),
  })
  if (!sessionRes.ok) throw new Error(`upload-session ${sessionRes.status}: ${await sessionRes.text()}`)
  const { uploadUrl } = (await sessionRes.json()) as UploadSession

  const total = file.size
  if (total === 0) throw new Error('Cannot upload empty file')

  let offset = 0
  let finalJson: unknown = null
  while (offset < total) {
    const end = Math.min(offset + CHUNK_BYTES, total) - 1
    const chunk = file.slice(offset, end + 1)
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Range': `bytes ${offset}-${end}/${total}` },
      body: chunk,
    })
    if (!res.ok && res.status !== 202) {
      throw new Error(`upload chunk ${offset}-${end} → ${res.status}`)
    }
    offset = end + 1
    onProgress?.(Math.round((offset / total) * 100))
    if (res.status === 200 || res.status === 201) {
      finalJson = await res.json().catch(() => null)
    }
  }
  return finalJson as DriveItem
}

export type RecentItem = DriveItem & {
  parentReference?: { path?: string; name?: string }
}

export type ProjectStatus = 'lead' | 'in-progress' | 'on-hold' | 'wrapping-up' | 'complete'

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  lead: 'Lead',
  'in-progress': 'In progress',
  'on-hold': 'On hold',
  'wrapping-up': 'Wrapping up',
  complete: 'Complete',
}

export type ProjectMeta = {
  client?: string
  address?: string
  phone?: string
  email?: string
  dollarAmount?: number
  startDate?: string
  dueDate?: string
  status?: ProjectStatus
  notes?: string
}

export const getProjectMeta = (name: string) =>
  jget<ProjectMeta>(`/api/graph/project/${encodeURIComponent(name)}/meta`)

export async function saveProjectMeta(name: string, meta: ProjectMeta): Promise<void> {
  const res = await fetch(`/api/graph/project/${encodeURIComponent(name)}/meta`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(meta),
  })
  if (!res.ok) throw new Error(`saveProjectMeta ${res.status}: ${await res.text()}`)
}

export function formatCurrency(amount?: number): string {
  if (amount == null || isNaN(amount)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getRecent = (limit = 15) =>
  jget<{ value: RecentItem[] }>(`/api/graph/recent?limit=${limit}`)
export const getLeads = () => jget<{ value: DriveItem[] }>('/api/graph/leads')
export const getReceipts = (path?: string) =>
  jget<{ value: DriveItem[] }>(
    `/api/graph/receipts${path ? `?path=${encodeURIComponent(path)}` : ''}`,
  )

export type SubcontractorsSheet = {
  fileId: string
  fileName: string
  sheetName?: string
  address?: string
  values: (string | number | null)[][]
}
export const getSubcontractors = () => jget<SubcontractorsSheet>('/api/graph/subcontractors')

/** Convert a Graph parentReference path (e.g. "/drive/root:/NCP Contracting LLC/01-Active Projects/SDF Renn/03-Photos") into a workflow-friendly tuple */
export function parseProjectPath(refPath: string | undefined): {
  project?: string
  stage?: string
  nested?: string[]
} {
  if (!refPath) return {}
  const prefix = '/drive/root:/NCP Contracting LLC/01-Active Projects/'
  const idx = refPath.indexOf(prefix)
  if (idx < 0) return {}
  const rest = refPath.slice(idx + prefix.length)
  const parts = rest.split('/').filter(Boolean)
  return { project: parts[0], stage: parts[1], nested: parts.slice(2) }
}

export async function moveFile(id: string, toPath: string): Promise<void> {
  const res = await fetch(`/api/graph/file/${encodeURIComponent(id)}/move`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ toPath }),
  })
  if (!res.ok) throw new Error(`move ${res.status}: ${await res.text()}`)
}

export const PROJECT_SUBFOLDERS = [
  '01-Contract',
  '02-Estimate',
  '03-Photos',
  '04-Permits',
  '05-Inspections',
  '06-Sub Invoicing',
  '07-Change Orders',
  '08-Client Communication',
  '09-Receipts',
  '10-Closeout',
] as const

export type ProjectSubfolder = (typeof PROJECT_SUBFOLDERS)[number]
