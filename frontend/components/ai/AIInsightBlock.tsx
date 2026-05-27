'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

type Severity = 'critical' | 'warning' | 'info' | 'good'

interface AIInsightBlockProps {
  severity: Severity
  text: string
  filename?: string
  line?: number
}

const config = {
  critical: {
    bg: 'bg-accent-red-dim',
    border: 'border-accent-red',
    text: 'text-accent-red',
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />,
    label: 'CRITICAL',
  },
  warning: {
    bg: 'bg-accent-amber-dim',
    border: 'border-accent-amber',
    text: 'text-accent-amber',
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />,
    label: 'WARNING',
  },
  info: {
    bg: 'bg-accent-purple-dim',
    border: 'border-accent-purple',
    text: 'text-accent-purple',
    icon: <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />,
    label: 'INFO',
  },
  good: {
    bg: 'bg-accent-green-dim',
    border: 'border-accent-green',
    text: 'text-accent-green',
    icon: <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />,
    label: 'GOOD',
  },
}

export function AIInsightBlock({ severity, text, filename, line }: AIInsightBlockProps) {
  const c = config[severity]
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${c.bg} border-l-2 ${c.border} rounded-r px-3 py-2`}
    >
      <span className={c.text}>{c.icon}</span>
      <div className="min-w-0">
        {filename && (
          <div className="text-[10px] font-mono text-text-muted mb-0.5">
            {filename}{line ? `:${line}` : ''}
          </div>
        )}
        <p className={`text-xs font-mono ${c.text} leading-relaxed`}>{text}</p>
      </div>
    </motion.div>
  )
}
