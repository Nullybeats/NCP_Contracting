import { type ReactNode } from 'react'

type Props = {
  title: ReactNode
  description?: ReactNode
  breadcrumb?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, breadcrumb, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 min-h-[64px] mb-8">
      <div className="min-w-0 flex-1">
        {breadcrumb && <div className="mb-1.5">{breadcrumb}</div>}
        <h1 className="text-2xl font-semibold tracking-tight truncate">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  )
}
