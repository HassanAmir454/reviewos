import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      {icon && (
        <div className="mb-4 opacity-20 text-text-muted">
          {icon}
        </div>
      )}
      <h3 className="font-mono text-sm font-medium text-text-secondary mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted font-mono max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
