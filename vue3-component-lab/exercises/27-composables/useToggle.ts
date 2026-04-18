import { ref } from 'vue'

export function useToggle(initial = false) {
  // TODO: create a boolean ref named value
  // TODO: expose toggle()
  // TODO: expose set(next: boolean)
  return {
    value: ref(initial),
    toggle() {},
    set(_next: boolean) {},
  }
}
