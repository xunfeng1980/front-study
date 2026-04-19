import { queryOptions } from '@tanstack/vue-query'

export function buildIssueListQuery(filters: { status: string; page: number }) {
  // TODO: return queryOptions(...)
  // TODO: queryKey should be ['issues', filters]
  // TODO: queryFn should resolve { items: [], total: 0 }
  return queryOptions({
    queryKey: ['TODO'],
    queryFn: async () => ({ items: [], total: 0 }),
  })
}
