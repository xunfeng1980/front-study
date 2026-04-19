export type ApiResponse<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; message: string }

export type SuccessResponse<T> = ApiResponse<T>

export function extractSuccessData<T>(response: ApiResponse<T>) {
  // TODO: make SuccessResponse use Extract
  // TODO: success -> response.data
  // TODO: error -> null
  return null
}
