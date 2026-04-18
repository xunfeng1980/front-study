export type SocketEnvelope<TPayload> = {
  type: string
  requestId: string
  payload: TPayload
}

export function createSocketEnvelope<TPayload>(
  type: string,
  requestId: string,
  payload: TPayload,
): SocketEnvelope<TPayload> {
  // TODO: return the standard websocket envelope
  return {
    type: 'TODO',
    requestId: 'TODO',
    payload,
  }
}
