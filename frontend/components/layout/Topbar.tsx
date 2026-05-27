'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LiveDot } from '@/components/ui/LiveDot'
import { Cpu, LogOut, Bell, RefreshCw } from 'lucide-react'
import { usePRStore } from '@/store/prStore'
import { DEFAULT_REPO } from '@/lib/constants'

interface TopbarProps {
  user: { name?: string | null; email?: string | null; image?: string | null } | null
}

export function Topbar({ user }: TopbarProps) {
  const connectedRepo = usePRStore(s => s.connectedRepo) || DEFAULT_REPO

  return (
    <header className="h-12 border-b border-border-subtle bg-bg-primary flex items-center px-4 gap-4 shrink-0 z-20">
      {/* Left — logo (hidden when sidebar visible) */}
      <div className="hidden lg:flex items-center gap-2 w-64 shrink-0">
        {/* space reserved for sidebar logo */}
      </div>

      {/* Repo indicator */}
      {connectedRepo && (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-bg-elevated border border-border-subtle">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-dot" />
          <span className="font-mono text-xs text-text-secondary">{connectedRepo}</span>
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          <LiveDot size="sm" />
          <span className="font-mono text-[10px] text-text-muted">LIVE</span>
        </div>

        {/* Notification bell placeholder */}
        <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-bg-hover transition-colors text-text-muted hover:text-text-secondary">
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? 'User'}
                width={28}
                height={28}
                className="rounded-full border border-border-default"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
                <span className="text-[11px] font-bold text-accent-purple">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
              </div>
            )}
            <span className="hidden md:block font-mono text-xs text-text-secondary">
              {user.name}
            </span>
          </div>
        )}

        {/* Sign out */}
        {user && (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-bg-hover transition-colors text-text-muted hover:text-accent-red"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  )
}
