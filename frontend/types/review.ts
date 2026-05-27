export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface AIReviewStream {
  reviewId: string
  status: 'idle' | 'streaming' | 'complete' | 'error'
  tokens: string[]
  fullText: string
  riskLevel: RiskLevel | null
  issueCount: number | null
}

export interface ParsedReviewBlock {
  type: 'summary' | 'issue' | 'positive' | 'suggestion' | 'risk' | 'heading' | 'text'
  severity?: 'critical' | 'warning' | 'info'
  filename?: string
  line?: number
  text: string
}

export interface StoredReview {
  id: string
  pr_number: number
  repo: string
  full_text: string
  risk_level: RiskLevel
  issue_count: number
  created_at: string
  model_used: string
}
