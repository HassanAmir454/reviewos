'use client'

import { useReviewStore } from '@/store/reviewStore'
import { useState, useCallback } from 'react'
import { usePRStore } from '@/store/prStore'
import { API_BASE_URL } from '@/lib/constants'
import { postReviewToGitHub } from '@/lib/api'

export function useAIReview(repo: string, prNumber: number) {
  const { streams, startStream, errorStream } = useReviewStore()
  const [isTriggering, setIsTriggering] = useState(false)
  const connectedRepo = usePRStore(s => s.connectedRepo)

  const reviewId = `review-${repo}-${prNumber}`
  const stream = streams[reviewId]

  const triggerReview = useCallback(async () => {
    // Derive a stable client ID from session storage
    let clientId = sessionStorage.getItem('ws-client-id')
    if (!clientId) {
      clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem('ws-client-id', clientId)
    }

    try {
      setIsTriggering(true)
      startStream(reviewId)

      const res = await fetch(`${API_BASE_URL}/reviews/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo,
          pr_number: prNumber,
          client_id: clientId,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Failed to trigger review')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      errorStream(reviewId, message)
    } finally {
      setIsTriggering(false)
    }
  }, [repo, prNumber, reviewId, startStream, errorStream])

  const postToGitHub = useCallback(async () => {
    if (!stream?.fullText) return;
    try {
      await postReviewToGitHub(repo, prNumber, stream.fullText);
      return true;
    } catch (err) {
      console.error("Failed to post to GitHub:", err);
      return false;
    }
  }, [repo, prNumber, stream?.fullText]);

  return { stream, triggerReview, isTriggering, postToGitHub }
}
