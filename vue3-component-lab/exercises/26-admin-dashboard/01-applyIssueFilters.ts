export type Issue = {
  id: number
  title: string
  status: 'open' | 'closed'
  assignee: string
}

export function applyIssueFilters(
  issues: Issue[],
  filters: { query: string; status: 'all' | 'open' | 'closed' },
) {
  // TODO: filter by query in title, case-insensitive
  // TODO: when status is not all, filter by status too
  return issues
}
