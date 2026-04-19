export function useTodoFilter(
  todos: Ref<Array<{ id: number; title: string; done: boolean }>>,
  query: Ref<string>,
) {
  // TODO: return a computed ref
  // TODO: filter todos by title
  // TODO: use query.value.trim().toLowerCase()
  return computed(() => todos.value)
}
