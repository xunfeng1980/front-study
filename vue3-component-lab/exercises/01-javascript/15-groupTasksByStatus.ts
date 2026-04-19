export type GroupableTask = {
  id: number
  status: 'todo' | 'doing' | 'done'
}

export function groupTasksByStatus(tasks: GroupableTask[]) {
  // TODO: use reduce to build { todo: Task[], doing: Task[], done: Task[] }
  return {
    todo: [],
    doing: [],
    done: [],
  }
}
