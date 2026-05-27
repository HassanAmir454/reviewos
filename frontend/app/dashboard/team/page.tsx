'use client'

import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Tag } from '@/components/ui/Tag'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Users, GitMerge, Clock, TrendingUp } from 'lucide-react'
import { useTeamStats } from '@/hooks/useAnalytics'

const REPO = process.env.NEXT_PUBLIC_DEFAULT_REPO || 'vercel/next.js'

const mockTeam = [
  { username: 'alice', avatar_url: '', pr_count: 42, merged_count: 38, merge_rate: 90.5, avg_days_to_merge: 1.4, lines_added: 12400, lines_removed: 4800, contribution_score: 94 },
  { username: 'bob', avatar_url: '', pr_count: 29, merged_count: 22, merge_rate: 75.9, avg_days_to_merge: 3.1, lines_added: 8100, lines_removed: 2200, contribution_score: 71 },
  { username: 'carol', avatar_url: '', pr_count: 17, merged_count: 17, merge_rate: 100, avg_days_to_merge: 0.8, lines_added: 5200, lines_removed: 1100, contribution_score: 88 },
  { username: 'dave', avatar_url: '', pr_count: 11, merged_count: 8, merge_rate: 72.7, avg_days_to_merge: 4.2, lines_added: 3300, lines_removed: 900, contribution_score: 52 },
]

export default function TeamPage() {
  const { data } = useTeamStats(REPO)
  const team = data ?? mockTeam
  const maxScore = Math.max(...team.map(t => t.contribution_score))

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-accent-green" />
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Team</h1>
          <p className="font-mono text-sm text-text-muted">
            Contributor profiles for <span className="text-accent-purple">{REPO}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((member, i) => {
          const isTop = i === 0
          const rateTag = member.merge_rate >= 90 ? 'good' : member.merge_rate >= 70 ? 'info' : 'warning'
          return (
            <motion.div
              key={member.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`bg-bg-elevated rounded-xl border p-5 flex flex-col gap-4 relative overflow-hidden ${
                isTop ? 'border-accent-green/30 shadow-[0_0_20px_rgba(0,255,136,0.05)]' : 'border-border-default'
              }`}
            >
              {isTop && <div className="absolute top-3 right-3"><Tag variant="good">TOP</Tag></div>}

              <div className="flex items-center gap-3">
                <Avatar username={member.username} size="lg" />
                <div>
                  <p className="font-mono font-bold text-text-primary">{member.username}</p>
                  <Tag variant={rateTag as 'good' | 'info' | 'warning'}>
                    {member.merge_rate.toFixed(0)}% merge rate
                  </Tag>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total PRs', value: member.pr_count },
                  { label: 'Merged', value: member.merged_count },
                  { label: 'Avg Time', value: `${member.avg_days_to_merge.toFixed(1)}d` },
                  { label: 'Score', value: Math.round(member.contribution_score) },
                ].map(s => (
                  <div key={s.label} className="bg-bg-primary rounded-lg p-2.5">
                    <SectionLabel>{s.label}</SectionLabel>
                    <p className="font-display text-xl font-extrabold text-text-primary mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
                  <span>Contribution Score</span>
                  <span>{Math.round(member.contribution_score)}</span>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(member.contribution_score / maxScore) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                    className={`h-full rounded-full ${isTop ? 'bg-accent-green' : 'bg-accent-purple'}`}
                  />
                </div>
              </div>

              <div className="flex gap-4 text-[11px] font-mono pt-1 border-t border-border-subtle">
                <span className="text-accent-green">+{member.lines_added.toLocaleString()}</span>
                <span className="text-accent-red">-{member.lines_removed.toLocaleString()}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
