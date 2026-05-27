'use client'

import { motion } from 'framer-motion'
import { PRStatusBadge } from './PRStatusBadge'
import { formatRelativeTime, truncate } from '@/lib/utils'
import type { PR } from '@/types/pr'
import { cn } from '@/lib/utils'

interface PRListItemProps {
  pr: PR
  isSelected: boolean
  onClick: () => void
}

export function PRListItem({ pr, isSelected, onClick }: PRListItemProps) {
  const statusText =
    pr.state === 'draft'
      ? 'DRAFT'
      : pr.reviewState === 'in_review'
      ? 'IN REVIEW'
      : pr.reviewState === 'conflicts'
      ? 'CONFLICTS'
      : 'OPEN'

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'w-full text-left px-3 py-2.5 border-b border-border-subtle transition-colors',
        isSelected
          ? 'bg-bg-hover border-l-2 border-l-accent-purple'
          : 'hover:bg-bg-elevated border-l-2 border-l-transparent'
      )}
    >
      {/* Row 1 — number + status */}
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[11px] font-bold text-accent-green shrink-0">
          #{pr.number}
        </span>
        <PRStatusBadge status={statusText as 'OPEN' | 'IN REVIEW' | 'CONFLICTS' | 'DRAFT'} />
        <span className="ml-auto font-mono text-[10px] text-text-ghost shrink-0">
          {formatRelativeTime(pr.updatedAt)}
        </span>
      </div>

      {/* Row 2 — title */}
      <p className={cn(
        'font-mono text-xs leading-snug mb-1.5',
        isSelected ? 'text-text-primary' : 'text-text-secondary'
      )}>
        {truncate(pr.title, 60)}
      </p>

      {/* Row 3 — diff stats + author */}
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="text-accent-green">+{pr.additions}</span>
        <span className="text-accent-red">-{pr.deletions}</span>
        <span className="text-text-ghost">·</span>
        <span className="text-text-muted">{pr.changedFiles} files</span>
        <span className="ml-auto text-text-ghost truncate max-w-[80px]">
          {pr.author}
        </span>
      </div>
    </motion.button>
  )
}
