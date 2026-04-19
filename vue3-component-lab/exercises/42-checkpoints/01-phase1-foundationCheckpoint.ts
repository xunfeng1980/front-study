export function buildFoundationCheckpoint(input: {
  apiBaseUrl: string
  port: number
  token: string | null
  filters: { status: string; page: number }
}) {
  // TODO: return { baseUrl, port, queryString, authHeader }
  return {
    baseUrl: '',
    port: 0,
    queryString: '',
    authHeader: null as string | null,
  }
}
