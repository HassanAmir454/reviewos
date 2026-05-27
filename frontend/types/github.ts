export interface GitHubPR {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  draft: boolean
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  head: { ref: string; sha: string }
  base: { ref: string; sha: string }
  labels: { name: string; color: string }[]
  additions?: number
  deletions?: number
  changed_files?: number
}

export interface GitHubFile {
  filename: string
  status: 'added' | 'removed' | 'modified' | 'renamed'
  additions: number
  deletions: number
  patch?: string
}

export interface GitHubComment {
  id: number
  user: { login: string; avatar_url: string }
  body: string
  created_at: string
  path?: string
  line?: number
}
