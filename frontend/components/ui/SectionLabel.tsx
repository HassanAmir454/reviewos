import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'text-[10px] uppercase tracking-[0.15em] text-text-muted font-mono font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}
