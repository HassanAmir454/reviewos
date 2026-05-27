import { cn } from '@/lib/utils'

interface SparkBarProps {
  values: number[]
  max?: number
  color?: 'green' | 'purple' | 'amber' | 'red'
  className?: string
}

const colorMap = {
  green: 'bg-accent-green',
  purple: 'bg-accent-purple',
  amber: 'bg-accent-amber',
  red: 'bg-accent-red',
}

export function SparkBar({ values, max, color = 'purple', className }: SparkBarProps) {
  const peak = max ?? Math.max(...values, 1)
  return (
    <div className={cn('flex items-end gap-0.5 h-8', className)}>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn('flex-1 rounded-sm opacity-60 hover:opacity-100 transition-opacity', colorMap[color])}
          style={{ height: `${Math.max(2, (v / peak) * 100)}%` }}
        />
      ))}
    </div>
  )
}
