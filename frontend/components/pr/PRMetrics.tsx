'use client'

import { motion } from 'framer-motion'
import { MetricCard } from '@/components/ui/MetricCard'
import type { PR } from '@/types/pr'

const riskVariant = (level: PR['aiRiskLevel']) => {
  if (level === 'critical') return 'red'
  if (level === 'high') return 'red'
  if (level === 'medium') return 'amber'
  return 'green'
}

const complexityVariant = (score: number | null) => {
  if (score === null) return 'default'
  if (score >= 8) return 'red'
  if (score >= 5) return 'amber'
  return 'green'
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export function PRMetrics({ pr }: { pr: PR }) {
  return (
    <motion.div
      key={pr.number}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-border-subtle bg-bg-secondary"
    >
      <motion.div variants={item}>
        <MetricCard
          label="Complexity Score"
          value={pr.complexityScore !== null ? pr.complexityScore.toFixed(1) : '—'}
          unit="/ 10"
          variant={complexityVariant(pr.complexityScore)}
          subtext={pr.complexityScore !== null && pr.complexityScore >= 8 ? 'High complexity' : undefined}
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          label="Files Changed"
          value={pr.changedFiles}
          unit="files"
          variant="purple"
          subtext={`+${pr.additions} / -${pr.deletions} lines`}
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          label="AI Risk Level"
          value={pr.aiRiskLevel ? pr.aiRiskLevel.toUpperCase() : 'N/A'}
          variant={riskVariant(pr.aiRiskLevel)}
          pulse={pr.aiRiskLevel === 'critical'}
          subtext={pr.aiRiskLevel === null ? 'Run AI review first' : undefined}
        />
      </motion.div>
    </motion.div>
  )
}
