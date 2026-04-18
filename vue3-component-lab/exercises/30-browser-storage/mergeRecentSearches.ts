export function mergeRecentSearches(
  existing: string[],
  nextQuery: string,
  limit = 5,
) {
  // TODO: trim nextQuery
  // TODO: ignore empty query
  // TODO: move duplicates to the front
  // TODO: cap to limit
  return existing
}
