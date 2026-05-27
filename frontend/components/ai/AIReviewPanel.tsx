'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { useAIReview } from '@/hooks/useAIReview'
import { LiveDot } from '@/components/ui/LiveDot'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'
import {
  Play, Copy, Download, Terminal, AlertTriangle,
  CheckCircle, Send
} from 'lucide-react'

/* ── helpers ─────────────────────────────────── */
function parseBlocks(text: string) {
  const blocks: { type: 'section' | 'critical' | 'warning' | 'good' | 'text'; heading?: string; content: string }[] = []
  const lines = text.split('\n')
  let current: (typeof blocks)[0] | null = null

  const flush = () => { if (current) blocks.push(current) }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush()
      current = { type: 'section', heading: line.replace('## ', ''), content: '' }
    } else if (/\[CRITICAL\]/i.test(line)) {
      flush()
      current = { type: 'critical', content: line }
    } else if (/\[WARNING\]/i.test(line)) {
      flush()
      current = { type: 'warning', content: line }
    } else if (/\[INFO\]/i.test(line)) {
      flush()
      current = { type: 'good', content: line }
    } else {
      if (!current) current = { type: 'text', content: '' }
      current.content += (current.content ? '\n' : '') + line
    }
  }
  flush()
  return blocks
}

/* ── component ───────────────────────────────── */
export function AIReviewPanel({ prNumber, repo }: { prNumber: number; repo: string }) {
  const { stream, triggerReview, isTriggering, postToGitHub } = useAIReview(repo, prNumber)
  const [isPosting, setIsPosting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (stream?.status === 'streaming' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [stream?.fullText, stream?.status])

  const handleCopy = useCallback(() => {
    if (stream?.fullText) navigator.clipboard.writeText(stream.fullText)
  }, [stream?.fullText])

  const handleExport = useCallback(() => {
    if (!stream?.fullText) return
    const blob = new Blob([stream.fullText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `review-pr-${prNumber}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [stream?.fullText, prNumber])

  const handlePost = useCallback(async () => {
    setIsPosting(true)
    const success = await postToGitHub()
    setIsPosting(false)
    if (success) {
      alert("Successfully posted to GitHub PR!")
    } else {
      alert("Failed to post to GitHub PR.")
    }
  }, [postToGitHub])

  const isStreaming = stream?.status === 'streaming'
  const isDone = stream?.status === 'complete'
  const isError = stream?.status === 'error'
  const hasContent = stream && stream.fullText.length > 0
  const blocks = hasContent ? parseBlocks(stream.fullText) : []

  return (
    <div className="flex flex-col border-t border-border-subtle bg-bg-elevated" style={{ height: '300px' }}>
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-border-subtle bg-bg-primary shrink-0">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-accent-green" />
          <span className="font-mono text-sm font-bold text-text-primary tracking-wide">
            ⬡ AI Review
          </span>
          {isStreaming && (
            <div className="flex items-center gap-1.5">
              <LiveDot size="sm" />
              <span className="text-[10px] font-mono text-accent-green tracking-widest uppercase">
                streaming live
              </span>
              <span className="inline-block w-1.5 h-3.5 bg-accent-green animate-blink ml-0.5 align-middle" />
            </div>
          )}
          {isDone && (
            <Tag variant="good">COMPLETE</Tag>
          )}
          {isError && (
            <Tag variant="critical">ERROR</Tag>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDone && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-text-secondary border border-border-default hover:text-text-primary hover:border-border-emphasis transition-colors"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-text-secondary border border-border-default hover:text-text-primary hover:border-border-emphasis transition-colors"
              >
                <Download className="w-3 h-3" /> Export .md
              </button>
              <button
                onClick={handlePost}
                disabled={isPosting}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-text-secondary border border-border-default hover:text-text-primary hover:border-border-emphasis transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3" /> {isPosting ? 'Posting...' : 'Post to PR'}
              </button>
            </>
          )}

          <button
            onClick={triggerReview}
            disabled={isTriggering || isStreaming}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all',
              isTriggering || isStreaming
                ? 'bg-bg-hover text-text-muted cursor-not-allowed'
                : 'bg-accent-green text-bg-primary hover:brightness-110 shadow-[0_0_12px_rgba(0,255,136,0.25)] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]'
            )}
          >
            <Play className="w-3 h-3" />
            {isStreaming ? 'ANALYZING…' : isDone ? 'RE-RUN' : 'RUN AI REVIEW'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {!hasContent && (
          <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-40 gap-2">
            <Terminal className="w-8 h-8" />
            <p className="font-mono text-sm">Ready to analyze PR #{prNumber}</p>
            <p className="font-mono text-xs">Click &quot;RUN AI REVIEW&quot; to start Claude analysis</p>
          </div>
        )}

        {hasContent && blocks.map((block, i) => {
          if (block.type === 'section') {
            return (
              <div key={i} className="pt-2 pb-1">
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-mono border-b border-border-subtle pb-1">
                  {block.heading}
                </div>
                {block.content && (
                  <p className="text-text-secondary text-xs font-mono leading-relaxed mt-1.5 whitespace-pre-wrap">
                    {block.content}
                  </p>
                )}
              </div>
            )
          }

          if (block.type === 'critical') {
            return (
              <div key={i} className="flex gap-2.5 bg-accent-red-dim border-l-2 border-accent-red rounded-r px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-red shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-accent-red leading-relaxed">{block.content}</p>
              </div>
            )
          }

          if (block.type === 'warning') {
            return (
              <div key={i} className="flex gap-2.5 bg-accent-amber-dim border-l-2 border-accent-amber rounded-r px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-accent-amber leading-relaxed">{block.content}</p>
              </div>
            )
          }

          if (block.type === 'good') {
            return (
              <div key={i} className="flex gap-2.5 bg-accent-green-dim border-l-2 border-accent-green rounded-r px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 text-accent-green shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-accent-green leading-relaxed">{block.content}</p>
              </div>
            )
          }

          // plain text
          return block.content.trim() ? (
            <p key={i} className="text-text-secondary text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          ) : null
        })}

        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 bg-accent-green animate-blink align-middle" />
        )}
      </div>
    </div>
  )
}
