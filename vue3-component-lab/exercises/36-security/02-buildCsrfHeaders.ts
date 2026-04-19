export function buildCsrfHeaders(
  headers: Record<string, string>,
  csrfToken: string | null,
) {
  // TODO: when csrfToken is missing, return the original headers
  // TODO: otherwise return a new object with x-csrf-token
  return headers
}
