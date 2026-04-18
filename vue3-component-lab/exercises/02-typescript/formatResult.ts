export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export function formatResult<T>(result: Result<T>) {
  // TODO: use union narrowing on `result.ok`
  // ok -> `success`
  // error -> `error:${result.error}`
  return 'TODO'
}
