'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitPullRequest, BarChart2, Users, Settings, Cpu, ChevronRight
} from 'lucide-react'
import { usePRStore } from '@/store/prStore'
import { usePRList } from '@/hooks/usePRList'
import { PRListItem } from '@/components/pr/PRListItem'
import { Skeleton } from '@/components/ui/Skeleton'
import { DEFAULT_REPO } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard/prs',       icon: GitPullRequest, label: 'Pull Requests' },
  { href: '/dashboard/analytics', icon: BarChart2,       label: 'Analytics' },
  { href: '/dashboard/team',      icon: Users,           label: 'Team' },
  { href: '/dashboard/settings',  icon: Settings,        label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { prs, selectedPRNumber, selectPR } = usePRStore()
  const repo = DEFAULT_REPO
  const { isLoading } = usePRList(repo)

  const isPRsPage = pathname.startsWith('/dashboard/prs')

  return (
    <aside className="w-64 bg-bg-primary border-r border-border-subtle flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-border-subtle flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
          <Cpu className="w-3.5 h-3.5 text-accent-green" />
        </div>
        <span className="font-display font-extrabold text-base tracking-tight">
          <span className="text-accent-green">Review</span>
          <span className="text-text-primary">OS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-3 border-b border-border-subtle space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono transition-all',
                active
                  ? 'bg-bg-hover text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              )}
            >
              <Icon className={cn('w-4 h-4', active ? 'text-accent-purple' : '')} />
              {label}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1 h-4 rounded-full bg-accent-purple"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* PR List — shown when on PRs page */}
      {isPRsPage && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* PR count header */}
          <div className="px-4 py-2.5 flex items-center justify-between shrink-0">
            <span className="text-[10px] uppercase tracking-widest font-mono text-text-muted">
              Open PRs
            </span>
            {!isLoading && (
              <span className="text-[10px] font-mono font-bold text-accent-green">
                {prs.length}
              </span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 space-y-2 py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : prs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-text-muted">
                <GitPullRequest className="w-6 h-6 opacity-30" />
                <p className="text-xs font-mono">No open PRs</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {prs.map(pr => (
                  <motion.div
                    key={pr.number}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PRListItem
                      pr={pr}
                      isSelected={pr.number === selectedPRNumber}
                      onClick={() => selectPR(pr.number)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
