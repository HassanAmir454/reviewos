'use client'

interface HeatmapCell {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ActivityHeatmapProps {
  data: HeatmapCell[]
}

const LEVELS = [
  'bg-bg-elevated border-border-subtle',
  'bg-accent-green/20',
  'bg-accent-green/40',
  'bg-accent-green/65',
  'bg-accent-green',
]

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Group into weeks of 7 days
  const weeks: HeatmapCell[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => (
              <div
                key={di}
                title={`${cell.date}: ${cell.count} contributions`}
                className={`w-3 h-3 rounded-[2px] border border-transparent ${LEVELS[cell.level]} transition-all hover:ring-1 hover:ring-accent-green/60 cursor-pointer`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono text-text-muted">
        <span>Less</span>
        {LEVELS.map((l, i) => (
          <span key={i} className={`w-3 h-3 rounded-[2px] ${l.split(' ')[0]}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
