export type Column = {
  key: string
  label: string
}

export const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
]

export function getColumnKeys() {
  // TODO: make columns readonly
  return columns.map(column => column.key)
}
