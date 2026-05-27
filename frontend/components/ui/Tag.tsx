import { cn } from '@/lib/utils'

type TagVariant = 'critical' | 'warning' | 'good' | 'info' | 'muted'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const styles: Record<TagVariant, string> = {
  critical: 'bg-accent-red-dim text-accent-red border-accent-red/20',
  warning:  'bg-accent-amber-dim text-accent-amber border-accent-amber/20',
  good:     'bg-accent-green-dim text-accent-green border-accent-green/20',
  info:     'bg-accent-purple-dim text-accent-purple border-accent-purple/20',
  muted:    'bg-bg-elevated text-text-muted border-border-default',
}

export function Tag({ variant = 'muted', children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
