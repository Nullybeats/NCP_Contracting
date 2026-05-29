import { useEffect, useMemo, useState } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { getSubcontractors, type SubcontractorsSheet } from '@/lib/onedrive'

export function SubcontractorsPage() {
  const [data, setData] = useState<SubcontractorsSheet | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const d = await getSubcontractors()
        if (alive) setData(d)
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => { alive = false }
  }, [])

  const { header, rows } = useMemo(() => {
    if (!data?.values?.length) return { header: [], rows: [] as (string | number | null)[][] }
    const [h, ...r] = data.values
    const headerStrings = h.map((cell) => String(cell ?? ''))
    // Skip empty rows
    const filteredRows = r.filter((row) => row.some((cell) => cell !== '' && cell !== null && cell !== undefined))
    return { header: headerStrings, rows: filteredRows }
  }, [data])

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    return rows.filter((row) => row.some((cell) => String(cell ?? '').toLowerCase().includes(q)))
  }, [rows, query])

  return (
    <div>
      <PageHeader
        title="Subcontractors"
        description={data ? `${rows.length} entries from ${data.fileName}.` : 'Loading master list…'}
        actions={
          data && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://onedrive.live.com/?id=${encodeURIComponent(data.fileId)}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Edit in OneDrive
              </a>
            </Button>
          )
        }
      />

      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!data && !error && (
          <div className="space-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        )}
        {data && rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Master list is empty.
            </CardContent>
          </Card>
        )}
        {data && rows.length > 0 && (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Card className="overflow-hidden p-0">
              <div className="overflow-auto max-h-[70vh]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-muted z-10">
                    <tr>
                      {header.map((h, i) => (
                        <th key={i} className="text-left font-semibold px-3 py-2.5 border-b text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          {h || `Col ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, i) => (
                      <tr key={i} className="even:bg-muted/30 hover:bg-accent transition">
                        {header.map((_, j) => (
                          <td key={j} className="px-3 py-2 border-b border-border/50 align-top">
                            {String(row[j] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRows.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No matches for "{query}".</p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
