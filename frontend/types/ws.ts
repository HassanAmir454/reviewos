import type { PR } from './pr'

export type WSMessage =
  | { type: 'pr.opened'; data: PR }
  | { type: 'pr.updated'; data: PR }
  | { type: 'pr.closed'; data: { number: number } }
  | { type: 'review.token'; data: { reviewId: string; token: string } }
  | { type: 'review.complete'; data: { reviewId: string; fullText: string } }
  | { type: 'review.error'; data: { reviewId: string; message: string } }
  | { type: 'sync.status'; data: { message: string; progress: number } }
