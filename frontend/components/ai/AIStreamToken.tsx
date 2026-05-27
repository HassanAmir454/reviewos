'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AIStreamTokenProps {
  token: string
  index: number
}

export function AIStreamToken({ token, index }: AIStreamTokenProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="text-text-secondary text-xs font-mono leading-relaxed whitespace-pre-wrap"
    >
      {token}
    </motion.span>
  )
}
