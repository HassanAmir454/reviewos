'use client'

import { useWebSocket } from '@/hooks/useWebSocket'
import { LiveDot } from '@/components/ui/LiveDot'

export function StatusBar() {
  const { isConnected } = useWebSocket()

  return (
    <div className="h-7 border-t border-border-subtle bg-bg-primary flex items-center px-4 gap-4 text-[10px] font-mono text-text-muted shrink-0">
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <>
            <LiveDot size="sm" />
            <span className="text-accent-green">WS Connected</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-accent-red opacity-60" />
            <span className="text-accent-red">WS Disconnected</span>
          </>
        )}
      </div>
      <span className="text-text-ghost">|</span>
      <span>ReviewOS v1.0</span>
      <div className="ml-auto">
        <span className="text-text-ghost">Claude claude-sonnet-4-20250514</span>
      </div>
    </div>
  )
}
