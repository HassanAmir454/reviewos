import { cn } from '@/lib/utils'

const colors = [
  'bg-accent-purple text-bg-primary',
  'bg-accent-green text-bg-primary',
  'bg-accent-amber text-bg-primary',
  'bg-accent-red text-bg-primary',
  '#7B61FF', '#00FF88', '#FFB800', '#FF6B6B',
]

function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const palette = ['#7B61FF', '#00FF88', '#FFB800', '#FF6B6B', '#6B8AFF', '#FF88CC', '#88FFCC']
  return palette[Math.abs(hash) % palette.length]
}

interface AvatarProps {
  username: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-8 h-8 text-[11px]',
  lg: 'w-10 h-10 text-sm',
}

export function Avatar({ username, avatarUrl, size = 'md', className }: AvatarProps) {
  const color = stringToColor(username)
  const initials = username
    .split(/[-_. ]/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={cn('rounded-full ring-1 ring-border-default object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-mono font-bold flex-shrink-0', sizeMap[size], className)}
      style={{ backgroundColor: color, color: '#0A0B0E' }}
    >
      {initials}
    </div>
  )
}
