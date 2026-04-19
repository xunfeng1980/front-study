export type ModalState = {
  open: boolean
  activeId: string | null
}

export type ModalAction =
  | { type: 'open'; id: string }
  | { type: 'close' }

export function stabilizeModalState(state: ModalState, action: ModalAction): ModalState {
  // TODO: open -> { open: true, activeId: action.id }
  // TODO: close -> { open: false, activeId: null }
  return state
}
