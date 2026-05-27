'use client'

import { motion } from 'framer-motion'

export type PRStatus = 'OPEN' | 'IN REVIEW' | 'CONFLICTS' | 'DRAFT' | 'APPROVED' | 'CHANGES' | 'CLOSED'

interface PRStatusBadgeProps {
  status: PRStatus
}

const badgeConfig: Record<PRStatus, { class: string }> = {
  'DRAFT': { class: 'bg-accent-amber-dim text-accent-amber border-accent-amber/25' },
  'OPEN': { class: 'bg-accent-green-dim text-accent-green border-accent-green/25' },
  'IN REVIEW': { class: 'bg-accent-purple-dim text-accent-purple border-accent-purple/25' },
  'APPROVED': { class: 'bg-accent-green-dim text-accent-green border-accent-green/40' },
  'CHANGES': { class: 'bg-accent-amber-dim text-accent-amber border-accent-amber/25' },
  'CONFLICTS': { class: 'bg-accent-red-dim text-accent-red border-accent-red/25' },
  'CLOSED': { class: 'text-text-muted border-border-default' },
}

export function PRStatusBadge({ status }: PRStatusBadgeProps) {
  const cfg = badgeConfig[status] ?? badgeConfig['OPEN']

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest border ${cfg.class}`}
    >
      {status}
    </motion.span>
  )
}
