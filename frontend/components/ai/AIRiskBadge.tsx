'use client'

import { motion } from 'framer-motion'
import type { RiskLevel } from '@/types/review'

interface AIRiskBadgeProps {
  level: RiskLevel | null
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  low: {
    label: 'LOW',
    class: 'bg-accent-green-dim text-accent-green border-accent-green/30',
    pulse: false,
  },
  medium: {
    label: 'MEDIUM',
    class: 'bg-accent-amber-dim text-accent-amber border-accent-amber/30',
    pulse: false,
  },
  high: {
    label: 'HIGH',
    class: 'bg-accent-red-dim text-accent-red border-accent-red/30',
    pulse: false,
  },
  critical: {
    label: 'CRITICAL',
    class: 'bg-accent-red-dim text-accent-red border-accent-red/60',
    pulse: true,
  },
}

const sizeClass = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2 py-0.5',
  lg: 'text-xs px-2.5 py-1',
}

export function AIRiskBadge({ level, size = 'md' }: AIRiskBadgeProps) {
  if (!level) {
    return (
      <span className={`font-mono font-bold tracking-widest border rounded ${sizeClass[size]} text-text-muted border-border-default`}>
        –
      </span>
    )
  }

  const c = config[level]

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`font-mono font-bold tracking-widest border rounded ${sizeClass[size]} ${c.class} ${
        c.pulse ? 'animate-[criticalPulse_2s_ease-in-out_infinite]' : ''
      }`}
    >
      {c.label}
    </motion.span>
  )
}
