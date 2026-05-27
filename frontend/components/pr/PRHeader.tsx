'use client'

import { motion } from 'framer-motion'
import { GitBranch, GitMerge, Clock, ExternalLink } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { PRStatusBadge } from './PRStatusBadge'
import { formatDate } from '@/lib/utils'
import type { PR } from '@/types/pr'

export function PRHeader({ pr }: { pr: PR }) {
  const statusText =
    pr.state === 'draft'
      ? 'DRAFT'
      : pr.reviewState === 'in_review'
      ? 'IN REVIEW'
      : pr.reviewState === 'conflicts'
      ? 'CONFLICTS'
      : 'OPEN'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-4 border-b border-border-subtle bg-bg-primary flex flex-col gap-3"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-accent-green font-bold text-sm shrink-0">
            #{pr.number}
          </span>
          <h2 className="font-display text-base font-bold text-text-primary leading-snug truncate">
            {pr.title}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PRStatusBadge status={statusText as 'OPEN' | 'IN REVIEW' | 'CONFLICTS' | 'DRAFT'} />
          {pr.labels.map(l => (
            <span
              key={l}
              className="px-2 py-0.5 rounded text-[10px] font-mono border border-border-default text-text-muted"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-6 text-xs font-mono text-text-secondary flex-wrap">
        <div className="flex items-center gap-2">
          <Avatar username={pr.author} avatarUrl={pr.authorAvatar} size="sm" />
          <span className="text-text-primary font-medium">{pr.author}</span>
        </div>

        <div className="flex items-center gap-1.5 text-text-muted">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="text-accent-purple">{pr.headBranch}</span>
          <span>→</span>
          <span>{pr.baseBranch}</span>
        </div>

        <div className="flex items-center gap-1.5 text-text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(pr.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-accent-green">+{pr.additions}</span>
          <span className="text-accent-red">-{pr.deletions}</span>
          <span className="text-text-muted">{pr.changedFiles} files</span>
        </div>
      </div>
    </motion.div>
  )
}
