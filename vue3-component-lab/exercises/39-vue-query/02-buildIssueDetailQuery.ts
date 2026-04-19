import { queryOptions } from '@tanstack/vue-query'

export function buildIssueDetailQuery(
  issueId: number | null,
  fetchIssue: (issueId: number) => Promise<{ id: number; title: string; comments: number }>,
) {
  // TODO: return queryOptions(...)
  // TODO: queryKey should be ['issue', issueId]
  // TODO: enabled should be Boolean(issueId)
  // TODO: select should map to { id, title, commentCount }
  return queryOptions({
    queryKey: ['TODO'],
    enabled: false,
    queryFn: async () => ({ id: 0, title: '', comments: 0 }),
  })
}
