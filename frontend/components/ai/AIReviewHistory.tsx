'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { StoredReview } from '@/types/review'
import { AIRiskBadge } from './AIRiskBadge'

interface AIReviewHistoryProps {
  reviews: StoredReview[]
}

function formatRelativeTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function AIReviewHistory({ reviews }: AIReviewHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (reviews.length === 0) {
    return (
      <div className="px-4 py-3 text-xs font-mono text-text-muted text-center">
        No previous reviews for this PR.
      </div>
    )
  }

  return (
    <div className="divide-y divide-border-subtle">
      {reviews.map((review) => (
        <div key={review.id}>
          <button
            onClick={() => setExpanded(expanded === review.id ? null : review.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover transition-colors text-left"
          >
            {expanded === review.id
              ? <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
              : <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <AIRiskBadge level={review.risk_level} size="sm" />
                <span className="text-[10px] font-mono text-text-muted">
                  {review.issue_count} issues · {review.model_used}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-text-ghost text-[10px] font-mono shrink-0">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(review.created_at)}
            </div>
          </button>

          <AnimatePresence>
            {expanded === review.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <pre className="px-4 py-3 text-[11px] font-mono text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-tertiary border-b border-border-subtle max-h-60 overflow-y-auto">
                  {review.full_text}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
