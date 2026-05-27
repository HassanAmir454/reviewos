'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface RadarAxis {
  label: string
  value: number  // 0–10
}

interface ComplexityRadarProps {
  axes: RadarAxis[]
  size?: number
}

export function ComplexityRadar({ axes, size = 200 }: ComplexityRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || axes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 32
    const levels = 5
    const angleSlice = (Math.PI * 2) / axes.length

    const rScale = d3.scaleLinear().domain([0, 10]).range([0, r])

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    // Draw level circles
    for (let level = 1; level <= levels; level++) {
      g.append('circle')
        .attr('r', (r / levels) * level)
        .attr('fill', 'none')
        .attr('stroke', '#1E2233')
        .attr('stroke-width', 1)
    }

    // Draw axis lines
    axes.forEach((_, i) => {
      const angle = angleSlice * i - Math.PI / 2
      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', r * Math.cos(angle))
        .attr('y2', r * Math.sin(angle))
        .attr('stroke', '#2A2E45')
        .attr('stroke-width', 1)
    })

    // Draw axis labels
    axes.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = (r + 16) * Math.cos(angle)
      const y = (r + 16) * Math.sin(angle)
      g.append('text')
        .attr('x', x).attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#4A4E65')
        .attr('font-size', '9px')
        .attr('font-family', 'JetBrains Mono')
        .text(axis.label)
    })

    // Draw polygon
    const points = axes.map((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const rad = rScale(axis.value)
      return [rad * Math.cos(angle), rad * Math.sin(angle)] as [number, number]
    })

    g.append('polygon')
      .attr('points', points.map(p => p.join(',')).join(' '))
      .attr('fill', 'rgba(123,97,255,0.15)')
      .attr('stroke', '#7B61FF')
      .attr('stroke-width', 1.5)

    // Draw dots
    points.forEach(([x, y], i) => {
      g.append('circle')
        .attr('cx', x).attr('cy', y)
        .attr('r', 3)
        .attr('fill', '#7B61FF')
    })
  }, [axes, size])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className="overflow-visible"
    />
  )
}
