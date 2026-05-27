'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPRDetail } from '@/lib/api'
import { usePRStore } from '@/store/prStore'
import { useEffect } from 'react'

export function usePRDetail(repo: string, number: number) {
  const updatePR = usePRStore(s => s.updatePR)

  const query = useQuery({
    queryKey: ['pr', repo, number],
    queryFn: () => fetchPRDetail(repo, number),
    enabled: !!repo && !!number,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (query.data) {
      // Keep the store in sync with detail data
      updatePR(query.data)
    }
  }, [query.data, updatePR])

  return query
}
