export function buildPlatformCheckpoint(input: {
  hasServiceWorker: boolean
  hasWasm: boolean
}) {
  // TODO: return { offlineReady, computeStrategy, refreshPrompt }
  return {
    offlineReady: false,
    computeStrategy: '',
    refreshPrompt: false,
  }
}
