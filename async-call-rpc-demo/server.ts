// server.ts
export function add(x: number, y: number) {
    return x + y
}
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// init.ts
import { AsyncCall } from 'async-call-rpc'
import * as server from './server.ts'
// create a server
AsyncCall(server, { channel })