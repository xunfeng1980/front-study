export type YTodoRecord = {
  id: string
  text: string
  done: boolean
}

export function createYTodoRecord(id: string, text: string): YTodoRecord {
  // TODO: trim text
  // TODO: return `{ id, text, done: false }`
  return {
    id: '',
    text: '',
    done: true,
  }
}
