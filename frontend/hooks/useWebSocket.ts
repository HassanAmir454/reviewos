'use client'

import { useEffect, useCallback, useRef } from 'react'
import { wsClient } from '@/lib/ws'
import { useReviewStore } from '@/store/reviewStore'
import { usePRStore } from '@/store/prStore'
import type { WSMessage } from '@/types/ws'

export function useWebSocket() {
  const { appendToken, completeStream, errorStream } = useReviewStore()
  const { addPR, updatePR, removePR } = usePRStore()
  const isSetup = useRef(false)

  const handleMessage = useCallback((msg: WSMessage) => {
    switch (msg.type) {
      case 'pr.opened':
        addPR(msg.data)
        break
      case 'pr.updated':
        updatePR(msg.data)
        break
      case 'pr.closed':
        removePR(msg.data.number)
        break
      case 'review.token':
        appendToken(msg.data.reviewId, msg.data.token)
        break
      case 'review.complete':
        completeStream(msg.data.reviewId, msg.data.fullText)
        break
      case 'review.error':
        errorStream(msg.data.reviewId, msg.data.message)
        break
    }
  }, [appendToken, completeStream, errorStream, addPR, updatePR, removePR])

  useEffect(() => {
    if (isSetup.current) return
    isSetup.current = true

    // Get or create stable client ID
    let clientId = sessionStorage.getItem('ws-client-id')
    if (!clientId) {
      clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem('ws-client-id', clientId)
    }

    wsClient.connect(clientId)
    const unsub = wsClient.addHandler(handleMessage)

    return () => {
      unsub()
    }
  }, [handleMessage])

  return { isConnected: wsClient.isConnected }
}
