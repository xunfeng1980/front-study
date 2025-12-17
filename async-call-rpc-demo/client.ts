import { AsyncCall } from 'async-call-rpc'
import type * as server from './server.ts'
const server = AsyncCall<typeof server>({}, { channel })
server.add(2, 40).then(console.log) // 42