import { keepPreviousData, queryOptions } from '@tanstack/vue-query'

export function buildSearchQuery(
  keyword: string,
  searchIssues: (keyword: string) => Promise<Array<{ id: number; title: string }>>,
) {
  // TODO: trim keyword first
  // TODO: enabled only when trimmed keyword length >= 2
  // TODO: placeholderData should use keepPreviousData
  return queryOptions({
    queryKey: ['TODO'],
    enabled: false,
    placeholderData: undefined,
    queryFn: async () => [],
  })
}
