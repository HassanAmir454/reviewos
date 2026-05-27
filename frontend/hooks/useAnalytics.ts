'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchVelocity, fetchHeatmap, fetchTeamStats } from '@/lib/api'

export function useVelocity(repo: string, days = 28) {
  return useQuery({
    queryKey: ['analytics', 'velocity', repo, days],
    queryFn: () => fetchVelocity(repo, days),
    enabled: !!repo,
    staleTime: 300_000,
  })
}

export function useHeatmap(repo: string, weeks = 12) {
  return useQuery({
    queryKey: ['analytics', 'heatmap', repo, weeks],
    queryFn: () => fetchHeatmap(repo, weeks),
    enabled: !!repo,
    staleTime: 300_000,
  })
}

export function useTeamStats(repo: string) {
  return useQuery({
    queryKey: ['analytics', 'team', repo],
    queryFn: () => fetchTeamStats(repo),
    enabled: !!repo,
    staleTime: 300_000,
  })
}
