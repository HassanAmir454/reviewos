'use client'

import { useEffect, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'hunk'
  content: string
  lineNum?: number
}

function parseDiff(diff: string): DiffLine[] {
  const lines = diff.split('\n')
  const result: DiffLine[] = []
  let ctxLine = 0

  for (const raw of lines) {
    if (raw.startsWith('@@')) {
      const m = raw.match(/@@ -\d+(?:,\d+)? \+(\d+)/)
      ctxLine = m ? parseInt(m[1], 10) : ctxLine
      result.push({ type: 'hunk', content: raw })
    } else if (raw.startsWith('+') && !raw.startsWith('+++')) {
      result.push({ type: 'added', content: raw.slice(1), lineNum: ctxLine++ })
    } else if (raw.startsWith('-') && !raw.startsWith('---')) {
      result.push({ type: 'removed', content: raw.slice(1) })
    } else if (!raw.startsWith('---') && !raw.startsWith('+++') && !raw.startsWith('diff ') && !raw.startsWith('index ')) {
      result.push({ type: 'context', content: raw.slice(1), lineNum: ctxLine++ })
    }
  }
  return result
}

interface DiffViewerProps {
  diff: string
  filename?: string
}

export function DiffViewer({ diff, filename }: DiffViewerProps) {
  const lines = useMemo(() => parseDiff(diff || ''), [diff])

  if (!diff) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-mono">
        Select a file to view the diff
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed">
      {filename && (
        <div className="sticky top-0 z-10 px-4 py-2 bg-bg-tertiary border-b border-border-subtle text-text-muted text-[11px] flex items-center gap-2">
          <span className="text-accent-purple">📄</span>
          {filename}
        </div>
      )}

      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => {
            if (line.type === 'hunk') {
              return (
                <tr key={i}>
                  <td colSpan={3} className="px-4 py-1 bg-bg-elevated text-text-muted text-[10px] border-y border-border-subtle select-none">
                    {line.content}
                  </td>
                </tr>
              )
            }

            const bgClass =
              line.type === 'added'
                ? 'bg-[rgba(0,255,136,0.05)]'
                : line.type === 'removed'
                ? 'bg-[rgba(255,107,107,0.05)]'
                : ''

            const symbolClass =
              line.type === 'added'
                ? 'text-accent-green select-none'
                : line.type === 'removed'
                ? 'text-accent-red select-none'
                : 'text-text-ghost select-none'

            const symbol =
              line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '

            const textClass =
              line.type === 'added'
                ? 'text-accent-green'
                : line.type === 'removed'
                ? 'text-accent-red'
                : 'text-text-secondary'

            return (
              <tr key={i} className={cn('group', bgClass)}>
                {/* Line number */}
                <td className="pl-4 pr-2 py-0.5 text-[10px] text-text-ghost text-right select-none w-10 border-r border-border-subtle">
                  {line.lineNum ?? ''}
                </td>
                {/* Symbol */}
                <td className={cn('px-2 py-0.5 w-4', symbolClass)}>
                  {symbol}
                </td>
                {/* Code */}
                <td className={cn('pr-4 py-0.5 whitespace-pre-wrap break-all', textClass)}>
                  {line.content}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
