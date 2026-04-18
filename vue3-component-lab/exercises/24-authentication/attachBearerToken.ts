export function attachBearerToken(
  headers: Record<string, string>,
  token: string | null,
) {
  // TODO: when token is null, return headers unchanged
  // TODO: otherwise return a new object with Authorization: `Bearer ${token}`
  return headers
}
