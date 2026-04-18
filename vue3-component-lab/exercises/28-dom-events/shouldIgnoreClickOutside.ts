export function shouldIgnoreClickOutside(target: {
  closest: (selector: string) => Element | null
}) {
  // TODO: return true when target is inside [data-ignore-outside]
  return false
}
