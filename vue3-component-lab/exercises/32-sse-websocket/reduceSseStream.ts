export type SseStreamState = {
  text: string
  usage: string
  done: boolean
}

export type SseStreamEvent =
  | { type: 'token'; chunk: string }
  | { type: 'usage'; promptTokens: number; completionTokens: number }
  | { type: 'done' }

export function reduceSseStream(
  state: SseStreamState,
  event: SseStreamEvent,
): SseStreamState {
  // TODO: token should append `chunk`
  // TODO: usage should become `prompt X / completion Y`
  // TODO: done should set `done: true`
  return state
}
