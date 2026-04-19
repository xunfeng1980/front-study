export type IdLabel<TId extends string | number = string> = {
  id: TId
  label: string
}

export function toIdLabel<TId extends string | number>(
  id: TId,
  label: string,
): IdLabel<TId> {
  // TODO: return a correctly typed object
  return { id: 'TODO' as TId, label: 'TODO' }
}
