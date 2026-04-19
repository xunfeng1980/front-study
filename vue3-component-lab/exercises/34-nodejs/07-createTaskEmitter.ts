import { EventEmitter } from 'node:events'

export function createTaskEmitter() {
  // TODO: create an EventEmitter
  // TODO: expose emitCreated(title) that emits `task:created`
  return {
    emitter: new EventEmitter(),
    emitCreated() {},
  }
}
