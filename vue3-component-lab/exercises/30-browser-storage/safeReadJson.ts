export function safeReadJson<T>(raw: string | null, fallback: T): T {
  // TODO: when raw is null, return fallback
  // TODO: parse JSON with try/catch
  // TODO: on parse error return fallback
  return fallback
}
