export function buildToggleIssueMutation(issueId: number) {
  // TODO: return an object that looks like TanStack Query mutation options
  // TODO: mutationKey should be ['toggle-issue', issueId]
  // TODO: mutationFn should receive nextStatus and resolve { id: issueId, status: nextStatus }
  return {
    mutationKey: ['TODO'],
    mutationFn: async () => ({ id: 0, status: 'open' as const }),
  }
}
