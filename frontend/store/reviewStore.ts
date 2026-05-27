import { create } from 'zustand'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface AIReviewStream {
  reviewId: string
  status: 'idle' | 'streaming' | 'complete' | 'error'
  tokens: string[]
  fullText: string
  riskLevel: RiskLevel | null
  issueCount: number | null
}

interface ReviewStore {
  streams: Record<string, AIReviewStream>
  startStream: (reviewId: string) => void
  appendToken: (reviewId: string, token: string) => void
  completeStream: (reviewId: string, fullText: string) => void
  errorStream: (reviewId: string, message: string) => void
}

export const useReviewStore = create<ReviewStore>((set) => ({
  streams: {},
  startStream: (reviewId) => set((state) => ({
    streams: {
      ...state.streams,
      [reviewId]: {
        reviewId,
        status: 'streaming',
        tokens: [],
        fullText: '',
        riskLevel: null,
        issueCount: null
      }
    }
  })),
  appendToken: (reviewId, token) => set((state) => {
    const stream = state.streams[reviewId];
    if (!stream) return state;
    return {
      streams: {
        ...state.streams,
        [reviewId]: {
          ...stream,
          tokens: [...stream.tokens, token],
          fullText: stream.fullText + token
        }
      }
    };
  }),
  completeStream: (reviewId, fullText) => set((state) => {
    const stream = state.streams[reviewId];
    if (!stream) return state;
    return {
      streams: {
        ...state.streams,
        [reviewId]: {
          ...stream,
          status: 'complete',
          fullText
        }
      }
    };
  }),
  errorStream: (reviewId, message) => set((state) => {
    const stream = state.streams[reviewId];
    if (!stream) return state;
    return {
      streams: {
        ...state.streams,
        [reviewId]: {
          ...stream,
          status: 'error',
          fullText: stream.fullText + `\n\nError: ${message}`
        }
      }
    };
  })
}))
