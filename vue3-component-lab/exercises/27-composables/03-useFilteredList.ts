import { computed, type Ref } from 'vue'

export function useFilteredList<T extends { title: string }>(
  items: Ref<T[]>,
  query: Ref<string>,
) {
  // TODO: return a computed filtered list
  // TODO: trim and lowercase query
  // TODO: when query is empty, return all items
  return computed(() => items.value)
}
