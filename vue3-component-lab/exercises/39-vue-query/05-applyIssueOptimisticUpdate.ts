export type Issue = {
  id: number
  title: string
  status: 'open' | 'closed'
}

export function applyIssueOptimisticUpdate(
  issues: Issue[],
  updated: Pick<Issue, 'id' | 'status'>,
) {
  // TODO: return a new issues array
  // TODO: only patch the matching issue status
  return issues
}
