export function buildOpsCheckpoint() {
  // TODO: return { errorEvent, traceSampled, raceGuarded, selectionStable }
  return {
    errorEvent: false,
    traceSampled: false,
    raceGuarded: false,
    selectionStable: false,
  }
}
