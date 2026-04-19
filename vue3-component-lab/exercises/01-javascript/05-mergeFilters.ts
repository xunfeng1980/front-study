export function mergeFilters(
  defaults: { page: number; pageSize: number; tag: string },
  overrides: Partial<{ page: number; pageSize: number; tag: string }>,
) {
  // TODO: use object spread to merge defaults and overrides
  return defaults
}
