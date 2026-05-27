import { API_BASE_URL } from './constants'
import type { PR, PRDetail } from '@/types/pr'
import type { ContributorStats, VelocityDataPoint, HeatmapCell } from '@/types/analytics'

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new APIError(res.status, text || res.statusText)
  }
  return res.json() as Promise<T>
}

// --- PR endpoints ---
export function fetchPRs(repo: string, state = 'open'): Promise<PR[]> {
  return request<PR[]>(`/prs?repo=${encodeURIComponent(repo)}&state=${state}`)
}

export function fetchPRDetail(repo: string, number: number): Promise<PRDetail> {
  return request<PRDetail>(`/prs/${number}?repo=${encodeURIComponent(repo)}`)
}

// --- Review endpoints ---
export function triggerReview(repo: string, prNumber: number, clientId: string): Promise<{ status: string; review_id: string }> {
  return request('/reviews/trigger', {
    method: 'POST',
    body: JSON.stringify({ repo, pr_number: prNumber, client_id: clientId }),
  })
}

export function postReviewToGitHub(repo: string, prNumber: number, body: string): Promise<{ status: string }> {
  return request('/reviews/post', {
    method: 'POST',
    body: JSON.stringify({ repo, pr_number: prNumber, body }),
  })
}

// --- Analytics endpoints ---
export function fetchVelocity(repo: string, days = 28): Promise<VelocityDataPoint[]> {
  return request<VelocityDataPoint[]>(`/analytics/velocity?repo=${encodeURIComponent(repo)}&days=${days}`)
}

export function fetchHeatmap(repo: string, weeks = 12): Promise<HeatmapCell[]> {
  return request<HeatmapCell[]>(`/analytics/heatmap?repo=${encodeURIComponent(repo)}&weeks=${weeks}`)
}

export function fetchTeamStats(repo: string): Promise<ContributorStats[]> {
  return request<ContributorStats[]>(`/analytics/team?repo=${encodeURIComponent(repo)}`)
}

// --- Repo endpoints ---
export function connectRepo(owner: string, repo: string): Promise<{ id: string; full_name: string }> {
  return request('/repos/connect', {
    method: 'POST',
    body: JSON.stringify({ owner, repo }),
  })
}

export function fetchRepos(): Promise<{ id: string; full_name: string }[]> {
  return request('/repos')
}
