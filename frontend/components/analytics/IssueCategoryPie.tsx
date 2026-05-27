'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Category {
  name: string
  value: number
  color: string
}

interface IssueCategoryPieProps {
  data: Category[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated border border-border-emphasis rounded-lg px-3 py-2 text-xs font-mono shadow-xl">
      <p style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-text-primary">Count: {payload[0].value}</p>
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-col gap-1.5 text-[11px] font-mono">
      {payload?.map((entry: any, i: number) => (
        <li key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.value}</span>
          </div>
          <span className="text-text-primary">{entry.payload.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function IssueCategoryPie({ data }: IssueCategoryPieProps) {
  return (
    <div className="flex gap-4 items-center">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={72}
            dataKey="value"
            paddingAngle={3}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1">
        <CustomLegend payload={data.map(d => ({ value: d.name, color: d.color, payload: d }))} />
      </div>
    </div>
  )
}
