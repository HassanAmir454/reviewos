'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { usePRStore } from '@/store/prStore'
import { usePRDetail } from '@/hooks/usePRDetail'
import { PRHeader } from '@/components/pr/PRHeader'
import { PRMetrics } from '@/components/pr/PRMetrics'
import { DiffViewer } from '@/components/pr/DiffViewer'
import { FileTree } from '@/components/pr/FileTree'
import { AIReviewPanel } from '@/components/ai/AIReviewPanel'
import { AIReviewHistory } from '@/components/ai/AIReviewHistory'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_REPO = process.env.NEXT_PUBLIC_DEFAULT_REPO || 'vercel/next.js'

export default function PRDeepDivePage() {
  const params = useParams<{ prNumber: string }>()
  const router = useRouter()
  const prNumber = parseInt(params.prNumber, 10)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Keep global store in sync
  const selectPR = usePRStore(s => s.selectPR)
  useEffect(() => { selectPR(prNumber) }, [prNumber, selectPR])

  const { data: pr, isLoading, isError, error } = usePRDetail(DEFAULT_REPO, prNumber)

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  if (isError || !pr) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12" />}
          title="Failed to load PR"
          description={(error as Error)?.message ?? 'PR not found or API error.'}
          action={
            <Link
              href="/dashboard/prs"
              className="px-4 py-2 bg-accent-purple text-white rounded-md text-sm font-mono hover:brightness-110 transition-all"
            >
              ← Back to PRs
            </Link>
          }
        />
      </div>
    )
  }

  const files = pr.files ?? []
  const selectedPatch = selectedFile
    ? files.find(f => f.filename === selectedFile)?.patch ?? ''
    : pr.diff ?? ''

  const radarAxes = [
    { label: 'Complexity', value: pr.complexityScore ?? 3 },
    { label: 'Coverage',   value: 7 },
    { label: 'Docs',       value: 5 },
    { label: 'Coupling',   value: 6 },
    { label: 'Duplication',value: 4 },
    { label: 'Performance',value: 8 },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Back nav */}
      <div className="px-4 py-2 border-b border-border-subtle shrink-0">
        <Link
          href="/dashboard/prs"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to PR list
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <PRHeader pr={pr} />

        {/* Metrics */}
        <PRMetrics pr={pr} />

        {/* Diff + File tree */}
        <div className="flex overflow-hidden" style={{ height: '420px' }}>
          {files.length > 0 && (
            <div className="w-60 border-r border-border-subtle bg-bg-primary shrink-0 flex flex-col">
              <div className="px-3 py-2 border-b border-border-subtle">
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

        {/* AI Review Panel */}
        <AIReviewPanel prNumber={pr.number} repo={DEFAULT_REPO} />

        {/* Review History */}
        {pr.reviews && pr.reviews.length > 0 && (
          <div className="border-t border-border-subtle">
            <div className="px-4 py-2.5 bg-bg-primary">
              <SectionLabel>Review History ({pr.reviews.length})</SectionLabel>
            </div>
            <AIReviewHistory reviews={[]} />
          </div>
        )}
      </div>
    </div>
  )
}
