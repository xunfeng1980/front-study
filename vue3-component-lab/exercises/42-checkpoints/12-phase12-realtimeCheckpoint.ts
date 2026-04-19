export function buildRealtimeCheckpoint() {
  // TODO: return { sseUrl, socketEnvelope, reconnect, room }
  return {
    sseUrl: '',
    socketEnvelope: {} as Record<string, unknown>,
    reconnect: false,
    room: '',
  }
}
