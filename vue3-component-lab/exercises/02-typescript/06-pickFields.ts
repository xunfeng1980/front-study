export function pickFields<T extends object, K extends keyof T>(
  item: T,
  keys: K[],
): Pick<T, K> {
  // TODO: build a result object that only contains the picked keys
  return {} as Pick<T, K>
}
