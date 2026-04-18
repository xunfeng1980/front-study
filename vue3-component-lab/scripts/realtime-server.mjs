import http from 'node:http'
import { WebSocketServer } from 'ws'

const host = process.env.REALTIME_HOST ?? '127.0.0.1'
const port = Number(process.env.REALTIME_PORT ?? 4310)

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `${host}:${port}`}`)

  if (url.pathname === '/health') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
    response.end(JSON.stringify({ ok: true, transport: ['sse', 'websocket'] }))
    return
  }

  if (url.pathname === '/sse') {
    const topic = url.searchParams.get('topic')?.trim() || 'AI streaming transport'
    const includeUsage = url.searchParams.get('usage') !== 'false'
    const chunks = [
      `正在为「${topic}」建立上下文。`,
      '先返回结构化的增量文本，',
      '再在最后补 usage 和 done 事件。',
    ]

    response.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    response.write('retry: 1000\n\n')
    response.write(`event: status\ndata: ${JSON.stringify({ state: 'connected' })}\n\n`)

    let index = 0
    const timer = setInterval(() => {
      if (index < chunks.length) {
        response.write(
          `event: token\ndata: ${JSON.stringify({ chunk: chunks[index] })}\n\n`,
        )
        index += 1
        return
      }

      if (includeUsage) {
        response.write(
          `event: usage\ndata: ${JSON.stringify({ promptTokens: 18, completionTokens: 24 })}\n\n`,
        )
      }

      response.write(
        `event: done\ndata: ${JSON.stringify({ reason: 'stream-complete' })}\n\n`,
      )
      clearInterval(timer)
      response.end()
    }, 420)

    request.on('close', () => {
      clearInterval(timer)
    })

    return
  }

  response.writeHead(404, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify({ error: 'not-found' }))
})

const websocketServer = new WebSocketServer({ noServer: true })

websocketServer.on('connection', (socket) => {
  socket.send(
    JSON.stringify({
      type: 'system.ready',
      message: 'websocket-connected',
    }),
  )

  socket.on('message', (raw) => {
    let payload

    try {
      payload = JSON.parse(raw.toString())
    } catch {
      socket.send(JSON.stringify({ type: 'error', message: 'invalid-json' }))
      return
    }

    if (payload.type !== 'chat.prompt') {
      socket.send(JSON.stringify({ type: 'error', message: 'unsupported-type' }))
      return
    }

    const requestId = payload.requestId ?? `req-${Date.now()}`
    const prompt = String(payload.payload?.prompt ?? 'Untitled prompt')
    const chunks = [
      `已收到问题：${prompt}`,
      'WebSocket 适合双向会话、presence 和协同状态。',
      '这就是很多 AI 对话和协同编辑场景的基础。',
    ]

    socket.send(JSON.stringify({ type: 'chat.started', requestId }))

    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        socket.send(JSON.stringify({ type: 'chat.delta', requestId, chunk }))
      }, 260 * (index + 1))
    })

    setTimeout(() => {
      socket.send(JSON.stringify({ type: 'chat.done', requestId }))
    }, 260 * (chunks.length + 1))
  })
})

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `${host}:${port}`}`)

  if (url.pathname !== '/ws') {
    socket.destroy()
    return
  }

  websocketServer.handleUpgrade(request, socket, head, (ws) => {
    websocketServer.emit('connection', ws, request)
  })
})

server.listen(port, host, () => {
  console.log(`realtime playground server listening on http://${host}:${port}`)
})
