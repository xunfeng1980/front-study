export type RequestState<T> = {
  latestRequestId: string
  data: T | null
}

export function guardLatestRequest<T>(
  state: RequestState<T>,
  requestId: string,
  nextData: T,
) {
  // TODO: only update data when requestId matches state.latestRequestId
  // TODO: otherwise return the original state
  return state
}
