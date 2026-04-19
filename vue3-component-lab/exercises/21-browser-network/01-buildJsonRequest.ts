export function buildJsonRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  payload?: Record<string, unknown>,
) {
  // TODO: return a RequestInit-like object
  // TODO: include `method`
  // TODO: include `credentials: 'include'`
  // TODO: include Accept and Content-Type json headers
  // TODO: when payload exists, set `body: JSON.stringify(payload)`
  return {
    method: 'GET',
  }
}
