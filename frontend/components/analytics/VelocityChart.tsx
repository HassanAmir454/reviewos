'use client'

import {
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { SectionLabel } from '@/components/ui/SectionLabel'

interface DataPoint {
  date: string
  merged_count: number
  open_count: number
  closed_count: number
}

interface VelocityChartProps {
  data: DataPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated border border-border-emphasis rounded-lg px-3 py-2 text-xs font-mono shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="text-text-primary">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export function VelocityChart({ data }: VelocityChartProps) {
  return (
    <div className="w-full">
      <SectionLabel>PR Velocity</SectionLabel>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="mergedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF88" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2233" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(d: string) => d.slice(5)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4A4E65', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="merged_count"
            name="Merged"
            stroke="#7B61FF"
            strokeWidth={2}
            fill="url(#mergedGrad)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="open_count"
            name="Opened"
            stroke="#00FF88"
            strokeWidth={1.5}
            fill="url(#openGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
