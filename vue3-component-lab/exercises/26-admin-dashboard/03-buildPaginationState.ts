export function buildPaginationState(page: number, pageSize: number, total: number) {
  // TODO: return { page, pageSize, total, totalPages }
  // TODO: totalPages should be Math.ceil(total / pageSize)
  return {
    page,
    pageSize,
    total,
    totalPages: 0,
  }
}
