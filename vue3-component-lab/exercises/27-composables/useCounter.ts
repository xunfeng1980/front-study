import { computed, ref } from 'vue'

export function useCounter(initial = 0) {
  // TODO: create a count ref
  // TODO: expose increment and decrement
  // TODO: expose isPositive as a computed
  return {
    count: ref(initial),
    increment() {},
    decrement() {},
    isPositive: computed(() => false),
  }
}
