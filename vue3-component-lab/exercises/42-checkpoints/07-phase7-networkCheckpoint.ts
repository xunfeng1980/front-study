export function buildNetworkCheckpoint(input: {
  method: string
  hasCustomHeader: boolean
  cacheControl: string
}) {
  // TODO: return { willPreflight, cachePolicy, requestMode }
  return {
    willPreflight: false,
    cachePolicy: '',
    requestMode: '',
  }
}
