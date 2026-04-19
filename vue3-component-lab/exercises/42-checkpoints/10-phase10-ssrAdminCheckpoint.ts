export function buildSsrAdminCheckpoint() {
  // TODO: return { renderStrategy, asyncData, filters, pagination }
  return {
    renderStrategy: '' as 'ssr' | 'csr' | 'ssg',
    asyncData: {
      server: false,
      lazy: false,
    },
    filters: [] as string[],
    pagination: '',
  }
}
