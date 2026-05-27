export interface VelocityDataPoint {
  date: string
  merged_count: number
  open_count: number
  closed_count: number
}

export interface HeatmapCell {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributorStats {
  username: string
  avatar_url: string
  pr_count: number
  merged_count: number
  merge_rate: number
  avg_days_to_merge: number
  lines_added: number
  lines_removed: number
  contribution_score: number
}
