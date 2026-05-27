'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { motion } from 'framer-motion'
import { useVelocity, useHeatmap, useTeamStats } from '@/hooks/useAnalytics'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { Activity, GitMerge, Clock, AlertTriangle } from 'lucide-react'

const REPO = process.env.NEXT_PUBLIC_DEFAULT_REPO || 'vercel/next.js'

/* ── Mock data (used when API is unavailable) ─ */
const mockVelocity = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (27 - i))
  return {
    date: d.toISOString().slice(0, 10),
    merged_count: Math.floor(Math.random() * 8),
    open_count: Math.floor(Math.random() * 12) + 2,
    closed_count: Math.floor(Math.random() * 4),
  }
})

const mockTeam = [
  { username: 'alice', avatar_url: '', pr_count: 42, merged_count: 38, merge_rate: 90.5, avg_days_to_merge: 1.4, lines_added: 12400, lines_removed: 4800, contribution_score: 94 },
  { username: 'bob', avatar_url: '', pr_count: 29, merged_count: 22, merge_rate: 75.9, avg_days_to_merge: 3.1, lines_added: 8100, lines_removed: 2200, contribution_score: 71 },
  { username: 'carol', avatar_url: '', pr_count: 17, merged_count: 17, merge_rate: 100, avg_days_to_merge: 0.8, lines_added: 5200, lines_removed: 1100, contribution_score: 88 },
  { username: 'dave', avatar_url: '', pr_count: 11, merged_count: 8, merge_rate: 72.7, avg_days_to_merge: 4.2, lines_added: 3300, lines_removed: 900, contribution_score: 52 },
]

const issueCategories = [
  { name: 'Security', value: 14, color: '#FF6B6B' },
  { name: 'Performance', value: 22, color: '#FFB800' },
  { name: 'Logic', value: 31, color: '#7B61FF' },
  { name: 'Style', value: 18, color: '#00FF88' },
  { name: 'Tests', value: 15, color: '#6B8AFF' },
]

/* ── Custom Tooltip ─────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated border border-border-emphasis rounded-lg px-3 py-2 text-xs font-mono shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="text-text-primary">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

/* ── Heatmap ─────────────────────────────────── */
function ActivityHeatmap({ data }: { data: { date: string; count: number; level: number }[] }) {
  const levels = ['bg-bg-elevated', 'bg-accent-green/25', 'bg-accent-green/50', 'bg-accent-green/75', 'bg-accent-green']

  return (
    <div className="flex gap-1 flex-wrap">
      {data.map((cell, i) => (
        <div
          key={i}
          title={`${cell.date}: ${cell.count} contributions`}
          className={`w-3 h-3 rounded-sm ${levels[cell.level]} transition-all hover:ring-1 hover:ring-accent-green/60 cursor-pointer`}
        />
      ))}
    </div>
  )
}

/* ── Main page ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
}

export default function AnalyticsPage() {
  const velocity = useVelocity(REPO)
  const heatmap = useHeatmap(REPO)
  const team = useTeamStats(REPO)

  const velocityData = velocity.data ?? mockVelocity
  const teamData = team.data ?? mockTeam

  // Build heatmap cells (84 days)
  const heatmapData = heatmap.data ?? Array.from({ length: 84 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (83 - i))
    const count = Math.floor(Math.random() * 12)
    return { date: d.toISOString().slice(0, 10), count, level: Math.min(4, Math.floor(count / 3)) as 0|1|2|3|4 }
  })

  const maxScore = Math.max(...teamData.map(t => t.contribution_score))

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Page header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-5 h-5 text-accent-purple" />
          <h1 className="font-display text-2xl font-bold text-text-primary">Analytics</h1>
        </div>
        <p className="font-mono text-sm text-text-muted">
          Team velocity, contribution patterns, and code quality trends for{' '}
          <span className="text-accent-purple">{REPO}</span>
        </p>
      </motion.div>

      {/* Row 1 — Velocity + Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Velocity chart — spans 2 cols */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="xl:col-span-2 bg-bg-elevated rounded-xl border border-border-default p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionLabel>PR Velocity</SectionLabel>
              <p className="font-display text-xl font-bold text-text-primary mt-1">
                {velocityData.reduce((s, d) => s + d.merged_count, 0)} merged (28d)
              </p>
            </div>
            <GitMerge className="w-5 h-5 text-accent-purple opacity-60" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="mergedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2233" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="merged_count" name="Merged" stroke="#7B61FF"
                strokeWidth={2} fill="url(#mergedGrad)" dot={false} />
              <Area type="monotone" dataKey="open_count" name="Opened" stroke="#00FF88"
                strokeWidth={1.5} fill="url(#openGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Issue category pie */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="bg-bg-elevated rounded-xl border border-border-default p-5">
          <div className="mb-4">
            <SectionLabel>Issue Categories</SectionLabel>
            <p className="font-display text-xl font-bold text-text-primary mt-1">
              {issueCategories.reduce((s, c) => s + c.value, 0)} flagged
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={issueCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value" paddingAngle={3}>
                {issueCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {issueCategories.map(c => (
              <div key={c.name} className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-text-secondary">{c.name}</span>
                </div>
                <span className="text-text-primary">{c.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2 — Heatmap */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
        className="bg-bg-elevated rounded-xl border border-border-default p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Activity Heatmap</SectionLabel>
            <p className="font-mono text-sm text-text-secondary mt-1">12-week contribution pattern</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
            <span>Less</span>
            {[0,1,2,3,4].map(l => (
              <span key={l} className={`w-3 h-3 rounded-sm ${
                ['bg-bg-hover','bg-accent-green/25','bg-accent-green/50','bg-accent-green/75','bg-accent-green'][l]
              }`} />
            ))}
            <span>More</span>
          </div>
        </div>
        <ActivityHeatmap data={heatmapData} />
      </motion.div>

      {/* Row 3 — Team Leaderboard */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
        className="bg-bg-elevated rounded-xl border border-border-default p-5">
        <div className="mb-4">
          <SectionLabel>Team Leaderboard</SectionLabel>
          <p className="font-mono text-sm text-text-secondary mt-1">Contributor stats for {REPO}</p>
        </div>
        <div className="space-y-4">
          {teamData.map((c, i) => (
            <div key={c.username} className="flex items-center gap-4">
              <span className="font-mono text-sm text-text-muted w-5 text-right">{i + 1}</span>
              <Avatar username={c.username} avatarUrl={c.avatar_url} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-sm font-medium text-text-primary">{c.username}</span>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-text-muted">
                    <span className="text-accent-green">{c.merged_count} merged</span>
                    <span>{Math.round(c.merge_rate)}% rate</span>
                    <span>{c.avg_days_to_merge.toFixed(1)}d avg</span>
                  </div>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.contribution_score / maxScore) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-accent-green' : i < 3 ? 'bg-accent-purple' : 'bg-border-emphasis'
                    }`}
                  />
                </div>
              </div>
              <span className="font-display font-extrabold text-lg w-10 text-right"
                style={{ color: i === 0 ? '#00FF88' : i < 3 ? '#7B61FF' : '#4A4E65' }}>
                {Math.round(c.contribution_score)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Row 4 — Merge time bar chart */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show"
        className="bg-bg-elevated rounded-xl border border-border-default p-5">
        <div className="mb-4">
          <SectionLabel>Merge Time Distribution</SectionLabel>
          <p className="font-mono text-sm text-text-secondary mt-1">Time from open to merge (hours)</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={[
            { bucket: '< 1h', count: 12 }, { bucket: '1–4h', count: 28 },
            { bucket: '4–12h', count: 19 }, { bucket: '12–24h', count: 14 },
            { bucket: '1–3d', count: 9 }, { bucket: '3–7d', count: 5 }, { bucket: '> 7d', count: 2 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2233" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="PRs" fill="#7B61FF" opacity={0.7} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
