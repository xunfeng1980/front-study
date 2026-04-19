export type CommandItem = {
  id: string
  title: string
  keywords: string[]
}

export function filterCommandPalette(items: CommandItem[], query: string) {
  // TODO: trim and lowercase the query
  // TODO: match title and keywords
  // TODO: keep original order
  return items
}
