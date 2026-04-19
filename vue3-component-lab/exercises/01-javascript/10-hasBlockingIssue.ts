export type Issue = {
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'blocked' | 'done'
}

export function hasBlockingIssue(issues: Issue[]) {
  // TODO: return true when at least one issue is high priority and not done
  return false
}
