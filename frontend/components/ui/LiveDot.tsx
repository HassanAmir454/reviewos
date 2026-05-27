'use client'

export function LiveDot({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
  return (
    <span className="relative inline-flex">
      <span className={`${sz} rounded-full bg-accent-green animate-pulse-dot`} />
      <span className={`absolute inset-0 ${sz} rounded-full bg-accent-green opacity-30 scale-150 animate-pulse`} />
    </span>
  )
}
