'use client'

import { motion } from 'framer-motion'
import type { PR } from '@/types/pr'

type ReviewState = PR['reviewState']
type PRState = PR['state']

interface PRStatusBadgeProps {
  state: PRState
  reviewState: ReviewState
}

const badgeConfig: Record<string, { label: string; class: string }> = {
  draft: { label: 'DRAFT', class: 'bg-accent-amber-dim text-accent-amber border-accent-amber/25' },
  open_pending: { label: 'OPEN', class: 'bg-accent-green-dim text-accent-green border-accent-green/25' },
  open_in_review: { label: 'IN REVIEW', class: 'bg-accent-purple-dim text-accent-purple border-accent-purple/25' },
  open_approved: { label: 'APPROVED', class: 'bg-accent-green-dim text-accent-green border-accent-green/40' },
  open_changes_requested: { label: 'CHANGES', class: 'bg-accent-amber-dim text-accent-amber border-accent-amber/25' },
  open_conflicts: { label: 'CONFLICTS', class: 'bg-accent-red-dim text-accent-red border-accent-red/25' },
  closed: { label: 'CLOSED', class: 'text-text-muted border-border-default' },
}

function getKey(state: PRState, reviewState: ReviewState): string {
  if (state === 'draft') return 'draft'
  if (state === 'closed') return 'closed'
  return `open_${reviewState}`
}

export function PRStatusBadge({ state, reviewState }: PRStatusBadgeProps) {
  const key = getKey(state, reviewState)
  const cfg = badgeConfig[key] ?? badgeConfig['open_pending']

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest border ${cfg.class}`}
    >
      {cfg.label}
    </motion.span>
  )
}
