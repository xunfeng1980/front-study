export function buildDataSecurityCheckpoint() {
  // TODO: return { queryKey, optimistic, csrfHeader, redirect }
  return {
    queryKey: [] as unknown[],
    optimistic: false,
    csrfHeader: '',
    redirect: '',
  }
}
