'use client'

import { useWebSocket } from '@/hooks/useWebSocket'

/**
 * Mounts the WebSocket connection globally.
 * Must be placed inside the QueryProvider so hooks work correctly.
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket()
  return <>{children}</>
}
