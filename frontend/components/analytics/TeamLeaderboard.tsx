'use client'

import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import type { ContributorStats } from '@/types/analytics'

interface TeamLeaderboardProps {
  data: ContributorStats[]
}

export function TeamLeaderboard({ data }: TeamLeaderboardProps) {
  const maxScore = Math.max(...data.map(c => c.contribution_score), 1)

  return (
    <div className="space-y-4">
      {data.map((member, i) => {
        const isTop = i === 0
        const barColor = isTop ? 'bg-accent-green' : i < 3 ? 'bg-accent-purple' : 'bg-border-emphasis'

        return (
          <motion.div
            key={member.username}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <span className="font-mono text-sm text-text-muted w-5 text-right shrink-0">
              {i + 1}
            </span>

            {/* Avatar */}
            <Avatar username={member.username} avatarUrl={member.avatar_url} size="md" />

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-sm font-medium text-text-primary truncate">
                  {member.username}
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted ml-2 shrink-0">
                  <span className="text-accent-green">{member.merged_count} merged</span>
                  <span>{Math.round(member.merge_rate)}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(member.contribution_score / maxScore) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>

            {/* Score */}
            <span
              className="font-display font-extrabold text-base w-9 text-right shrink-0"
              style={{ color: isTop ? '#00FF88' : i < 3 ? '#7B61FF' : '#4A4E65' }}
            >
              {Math.round(member.contribution_score)}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
