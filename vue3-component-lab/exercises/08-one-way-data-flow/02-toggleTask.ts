export type Task = {
  id: number
  title: string
  done: boolean
}

export function toggleTask(tasks: Task[], taskId: number): Task[] {
  // TODO: return a new array
  // TODO: only toggle the task whose id matches taskId
  // TODO: do not mutate the original tasks array
  return tasks
}
