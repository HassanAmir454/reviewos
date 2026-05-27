'use client'

import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  variant?: 'default' | 'green' | 'purple' | 'red' | 'amber'
  pulse?: boolean
  subtext?: string
}

const variantStyles = {
  default: 'border-border-default',
  green:   'border-accent-green/30 shadow-[0_0_15px_rgba(0,255,136,0.06)]',
  purple:  'border-accent-purple/30 shadow-[0_0_15px_rgba(123,97,255,0.06)]',
  red:     'border-accent-red/30 shadow-[0_0_15px_rgba(255,107,107,0.06)]',
  amber:   'border-accent-amber/30 shadow-[0_0_15px_rgba(255,184,0,0.06)]',
}

const valueStyles = {
  default: 'text-text-primary',
  green:   'text-accent-green',
  purple:  'text-accent-purple',
  red:     'text-accent-red',
  amber:   'text-accent-amber',
}

export function MetricCard({ label, value, unit, variant = 'default', pulse = false, subtext }: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-bg-elevated rounded-lg border p-4 flex flex-col gap-1 relative overflow-hidden',
        variantStyles[variant],
        pulse && 'animate-pulse'
      )}
    >
      {/* Background glow */}
      {variant !== 'default' && (
        <div className={cn(
          'absolute inset-0 opacity-5 pointer-events-none',
          variant === 'green'  && 'bg-accent-green',
          variant === 'purple' && 'bg-accent-purple',
          variant === 'red'    && 'bg-accent-red',
          variant === 'amber'  && 'bg-accent-amber',
        )} />
      )}

      <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn('font-display text-3xl font-extrabold', valueStyles[variant])}>
          {value}
        </span>
        {unit && <span className="text-xs text-text-muted font-mono">{unit}</span>}
      </div>
      {subtext && <span className="text-[10px] text-text-muted font-mono">{subtext}</span>}
    </div>
  )
}
