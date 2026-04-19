export function buildVueCoreCheckpoint(input: {
  query: string
  selectedTag: string
  loading: boolean
  error: string | null
}) {
  // TODO: return { filters, canRetry, viewState, events }
  return {
    filters: {
      query: '',
      selectedTag: '',
    },
    canRetry: false,
    viewState: 'idle' as 'idle' | 'loading' | 'error' | 'ready',
    events: [] as string[],
  }
}
