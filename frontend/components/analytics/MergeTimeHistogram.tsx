'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Bucket {
  bucket: string
  count: number
}

interface MergeTimeHistogramProps {
  data: Bucket[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated border border-border-emphasis rounded-lg px-3 py-2 text-xs font-mono shadow-xl">
      <p className="text-text-muted">{label}</p>
      <p className="text-accent-purple">{payload[0].value} PRs</p>
    </div>
  )
}

export function MergeTimeHistogram({ data }: MergeTimeHistogramProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2233" vertical={false} />
        <XAxis
          dataKey="bucket"
          tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="PRs" fill="#7B61FF" opacity={0.7} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
