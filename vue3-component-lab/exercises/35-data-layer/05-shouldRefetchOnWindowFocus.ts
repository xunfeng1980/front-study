export function shouldRefetchOnWindowFocus(
  staleAt: number,
  now: number,
  enabled: boolean,
) {
  // TODO: when disabled, always return false
  // TODO: otherwise return true only when now >= staleAt
  return false
}
