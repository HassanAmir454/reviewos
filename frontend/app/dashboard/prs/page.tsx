'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePRStore } from '@/store/prStore'
import { usePRList } from '@/hooks/usePRList'
import { usePRDetail } from '@/hooks/usePRDetail'
import { PRHeader } from '@/components/pr/PRHeader'
import { PRMetrics } from '@/components/pr/PRMetrics'
import { DiffViewer } from '@/components/pr/DiffViewer'
import { FileTree } from '@/components/pr/FileTree'
import { AIReviewPanel } from '@/components/ai/AIReviewPanel'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GitPullRequest, RefreshCw, AlertCircle } from 'lucide-react'
import { DEFAULT_REPO } from '@/lib/constants'

/* ── Inner component: loads full PR detail for selected PR ── */
function PRDetailPanel({ prNumber, repo }: { prNumber: number; repo: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { data: pr } = usePRDetail(repo, prNumber)

  const files = pr?.files ?? []
  const selectedPatch = selectedFile
    ? (files.find(f => f.filename === selectedFile)?.patch ?? '')
    : (pr?.diff ?? '')

  return (
    <motion.div
      key={prNumber}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* A — PR Header */}
      {pr && <PRHeader pr={pr} />}

      {/* B — Metrics */}
      {pr && <PRMetrics pr={pr} />}

      {/* C — Diff + File tree */}
      <div className="flex-1 flex overflow-hidden">
        {files.length > 0 && (
          <div className="w-56 border-r border-border-subtle bg-bg-primary shrink-0 flex flex-col">
            <div className="px-3 py-2 border-b border-border-subtle shrink-0">
              <SectionLabel>Changed Files ({files.length})</SectionLabel>
            </div>
            <FileTree
              files={files}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden bg-bg-secondary">
          <DiffViewer diff={selectedPatch} filename={selectedFile ?? undefined} />
        </div>
      </div>

      {/* D — AI Review Panel */}
      <AIReviewPanel prNumber={prNumber} repo={repo} />
    </motion.div>
  )
}

/* ── Main page ── */
export default function PRsPage() {
  const { selectedPRNumber, prs, selectPR } = usePRStore()
  const { isLoading, isError, error, refetch } = usePRList(DEFAULT_REPO)

  // Keyboard navigation J / K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (e.key !== 'j' && e.key !== 'k') return

    const currentIndex = prs.findIndex(p => p.number === selectedPRNumber)
    let nextIndex = currentIndex

    if (e.key === 'j') {
      nextIndex = currentIndex < prs.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : prs.length - 1
    }

    if (prs[nextIndex]) selectPR(prs[nextIndex].number)
  }, [prs, selectedPRNumber, selectPR])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Loading */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-text-muted">
            <RefreshCw className="w-6 h-6 animate-spin text-accent-purple" />
            <span className="font-mono text-sm">Syncing pull requests…</span>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={<AlertCircle className="w-12 h-12" />}
            title="Failed to load pull requests"
            description={(error as Error)?.message ?? 'Check backend connection and GitHub token.'}
            action={
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-accent-purple text-white rounded-md text-sm font-mono hover:brightness-110 transition-all"
              >
                Retry
              </button>
            }
          />
        </div>
      )}

      {/* No PR selected */}
      {!isLoading && !isError && !selectedPRNumber && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<GitPullRequest className="w-12 h-12" />}
            title={prs.length === 0 ? 'No open pull requests' : 'Select a pull request'}
            description={
              prs.length === 0
                ? 'When PRs are opened they will appear in the sidebar.'
                : 'Click any PR in the sidebar, or press J / K to navigate.'
            }
          />
        </div>
      )}

      {/* PR Detail */}
      <AnimatePresence mode="wait">
        {selectedPRNumber && !isLoading && !isError && (
          <PRDetailPanel
            key={selectedPRNumber}
            prNumber={selectedPRNumber}
            repo={DEFAULT_REPO}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
