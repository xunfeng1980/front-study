export type PageItem = {
  id: number
  title: string
}

export function mergePaginatedPages(previous: PageItem[], incoming: PageItem[]) {
  // TODO: merge pages without duplicate ids
  // TODO: keep the first occurrence order stable
  return previous
}
