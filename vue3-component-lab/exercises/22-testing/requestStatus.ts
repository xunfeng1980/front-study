export function requestStatus(state: 'idle' | 'loading' | 'success' | 'error') {
  if (state === 'loading') {
    return 'loading'
  }

  if (state === 'success') {
    return 'done'
  }

  if (state === 'error') {
    return 'failed'
  }

  return 'idle'
}
