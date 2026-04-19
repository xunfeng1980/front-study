import { infiniteQueryOptions } from '@tanstack/vue-query'

export function buildIssuesInfiniteQuery(
  fetchPage: (page: number) => Promise<{ items: Array<{ id: number }>; nextPage: number | null }>,
) {
  // TODO: return infiniteQueryOptions(...)
  // TODO: queryKey should be ['issues', 'infinite']
  // TODO: initialPageParam should be 1
  // TODO: getNextPageParam should return lastPage.nextPage
  return infiniteQueryOptions({
    queryKey: ['TODO'],
    initialPageParam: 0,
    queryFn: async () => ({ items: [], nextPage: null }),
    getNextPageParam: () => undefined,
  })
}
