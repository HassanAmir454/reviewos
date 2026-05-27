'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPRs } from '@/lib/api'
import { usePRStore } from '@/store/prStore'
import { useEffect } from 'react'
import { STALE_TIME_PR } from '@/lib/constants'

export function usePRList(repo: string, state = 'open') {
  const { setPRs } = usePRStore()

  const query = useQuery({
    queryKey: ['prs', repo, state],
    queryFn: () => fetchPRs(repo, state),
    enabled: !!repo,
    staleTime: STALE_TIME_PR,
    refetchInterval: 60_000,
  })

  useEffect(() => {
    if (query.data) {
      setPRs(query.data)
    }
  }, [query.data, setPRs])

  return query
}
