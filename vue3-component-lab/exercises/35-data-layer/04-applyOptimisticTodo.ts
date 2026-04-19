export type Todo = {
  id: number
  title: string
  done: boolean
}

export function applyOptimisticTodo(todos: Todo[], nextTodo: Todo) {
  // TODO: return a new todos array
  // TODO: replace the existing todo with the same id, or append it if missing
  return todos
}
