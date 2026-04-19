export function buildAsyncDataOptions(server: boolean, lazy: boolean) {
  // TODO: return { server, lazy, default: () => [] }
  return {
    server: false,
    lazy: false,
    default: () => ['TODO'],
  }
}
