export interface PR {
  number: number
  title: string
  state: 'open' | 'closed' | 'draft'
  reviewState: 'pending' | 'in_review' | 'approved' | 'changes_requested' | 'conflicts'
  author: string
  authorAvatar: string
  createdAt: string
  updatedAt: string
  additions: number
  deletions: number
  changedFiles: number
  baseBranch: string
  headBranch: string
  labels: string[]
  complexityScore: number | null
  aiRiskLevel: 'low' | 'medium' | 'high' | 'critical' | null
}

export interface PRDetail extends PR {
  body: string
  diff: string
  files: FileChange[]
  comments: PRComment[]
  reviews: AIReviewSummary[]
}

export interface FileChange {
  filename: string
  status: 'added' | 'modified' | 'removed' | 'renamed'
  additions: number
  deletions: number
  patch: string
}

export interface PRComment {
  id: number
  author: string
  authorAvatar: string
  body: string
  createdAt: string
  path?: string
  line?: number
}

export interface AIReviewSummary {
  id: string
  createdAt: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null
  issueCount: number
  model: string
}
