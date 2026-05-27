'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TerminalProps {
  lines: string[]
  className?: string
  showPrompt?: boolean
}

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  ({ lines, className, showPrompt = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-bg-primary border border-border-subtle rounded-lg p-4 font-mono text-xs overflow-y-auto',
          className
        )}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2 leading-relaxed">
            {showPrompt && (
              <span className="text-accent-green select-none flex-shrink-0">›</span>
            )}
            <span className="text-text-secondary whitespace-pre-wrap">{line}</span>
          </div>
        ))}
      </div>
    )
  }
)

Terminal.displayName = 'Terminal'
