export function shouldPreflight(
  method: string,
  headers: Record<string, string>,
) {
  // TODO: return true when method is not GET/HEAD/POST
  // TODO: return true when headers contain a non-simple header like Authorization
  // TODO: otherwise return false
  return false
}
