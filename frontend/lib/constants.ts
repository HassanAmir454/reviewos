export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export const STALE_TIME_PR = 60_000        // 60 s
export const STALE_TIME_ANALYTICS = 300_000 // 5 min
export const STALE_TIME_STATS = 3_600_000  // 1 hr

export const WS_RECONNECT_BASE_MS = 1_000
export const WS_RECONNECT_MAX_MS  = 30_000
export const WS_MAX_RETRIES       = 10

export const DEFAULT_REPO =
  process.env.NEXT_PUBLIC_DEFAULT_REPO || ''
