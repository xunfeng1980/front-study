export type Status = 'idle' | 'loading' | 'success' | 'error'

export const statusLabels = {
  idle: 'Idle',
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
}

export function getStatusLabel(status: Status) {
  // TODO: make statusLabels use satisfies Record<Status, string>
  return statusLabels[status]
}
