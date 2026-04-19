export type Todo = {
  id: number
  title: string
  done: boolean
}

export function filterDoneTodos(todos: Todo[]) {
  return todos.filter(t => t.done)
}
