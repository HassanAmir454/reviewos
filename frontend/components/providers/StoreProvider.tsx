'use client'

/**
 * Zustand stores are client-side only.
 * This wrapper ensures they are hydrated correctly in the App Router.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
