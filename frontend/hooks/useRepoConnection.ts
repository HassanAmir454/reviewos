'use client'

import { useQuery } from '@tanstack/react-query'
import { connectRepo, fetchRepos } from '@/lib/api'
import { usePRStore } from '@/store/prStore'
import { useState, useCallback } from 'react'

export function useRepoConnection() {
  const setRepo = usePRStore(s => s.setRepo)
  const connectedRepo = usePRStore(s => s.connectedRepo)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const repos = useQuery({
    queryKey: ['repos'],
    queryFn: fetchRepos,
    staleTime: 300_000,
  })

  const connect = useCallback(async (owner: string, repo: string) => {
    try {
      setIsConnecting(true)
      setError(null)
      await connectRepo(owner, repo)
      setRepo(`${owner}/${repo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect repository')
    } finally {
      setIsConnecting(false)
    }
  }, [setRepo])

  return { repos, connectedRepo, connect, isConnecting, error }
}
