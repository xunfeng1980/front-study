export type CacheControlResult = {
  noStore: boolean
  maxAge: number | null
}

export function parseCacheControl(header: string): CacheControlResult {
  // TODO: parse `no-store`
  // TODO: parse `max-age=123`
  // TODO: when max-age is absent, return null
  return {
    noStore: false,
    maxAge: null,
  }
}
