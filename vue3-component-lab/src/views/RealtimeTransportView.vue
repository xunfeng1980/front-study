<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SectionShell from '../components/SectionShell.vue'

const httpBaseUrl = 'http://127.0.0.1:4310'
const wsBaseUrl = 'ws://127.0.0.1:4310/ws'

const healthStatus = ref<'checking' | 'ready' | 'offline'>('checking')
const topic = ref('AI Todo summarization')

const sseStatus = ref<'idle' | 'connecting' | 'streaming' | 'done' | 'error'>('idle')
const sseText = ref('')
const sseUsage = ref('')
const sseEvents = ref<string[]>([])

const socketStatus = ref<'idle' | 'connecting' | 'connected' | 'closed'>('idle')
const socketPrompt = ref('Explain when to choose SSE vs WebSocket for AI apps.')
const socketLog = ref<string[]>([])

let eventSource: EventSource | null = null
let socket: WebSocket | null = null

const transportReady = computed(() => healthStatus.value === 'ready')

async function checkHealth() {
  healthStatus.value = 'checking'

  try {
    const response = await fetch(`${httpBaseUrl}/health`)
    healthStatus.value = response.ok ? 'ready' : 'offline'
  } catch {
    healthStatus.value = 'offline'
  }
}

function closeSse() {
  eventSource?.close()
  eventSource = null
}

function startSse() {
  closeSse()
  sseStatus.value = 'connecting'
  sseText.value = ''
  sseUsage.value = ''
  sseEvents.value = []

  const url = new URL(`${httpBaseUrl}/sse`)
  url.searchParams.set('topic', topic.value)
  url.searchParams.set('usage', 'true')

  eventSource = new EventSource(url)

  eventSource.addEventListener('status', (event) => {
    const payload = JSON.parse((event as MessageEvent<string>).data) as { state: string }
    sseStatus.value = payload.state === 'connected' ? 'streaming' : 'idle'
    sseEvents.value = [...sseEvents.value, `status:${payload.state}`]
  })

  eventSource.addEventListener('token', (event) => {
    const payload = JSON.parse((event as MessageEvent<string>).data) as { chunk: string }
    sseText.value += payload.chunk
    sseEvents.value = [...sseEvents.value, `token:${payload.chunk}`]
  })

  eventSource.addEventListener('usage', (event) => {
    const payload = JSON.parse((event as MessageEvent<string>).data) as {
      promptTokens: number
      completionTokens: number
    }
    sseUsage.value = `prompt ${payload.promptTokens} / completion ${payload.completionTokens}`
    sseEvents.value = [...sseEvents.value, 'usage']
  })

  eventSource.addEventListener('done', (event) => {
    const payload = JSON.parse((event as MessageEvent<string>).data) as { reason: string }
    sseStatus.value = 'done'
    sseEvents.value = [...sseEvents.value, `done:${payload.reason}`]
    closeSse()
  })

  eventSource.onerror = () => {
    if (sseStatus.value !== 'done') {
      sseStatus.value = 'error'
    }
  }
}

function closeSocket() {
  socket?.close()
  socket = null
}

function connectSocket() {
  if (socket && socket.readyState <= WebSocket.OPEN) {
    return
  }

  socketStatus.value = 'connecting'
  socket = new WebSocket(wsBaseUrl)

  socket.onopen = () => {
    socketStatus.value = 'connected'
    socketLog.value = [...socketLog.value, 'socket:connected']
  }

  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data) as {
      type: string
      chunk?: string
      message?: string
    }

    if (payload.type === 'chat.delta' && payload.chunk) {
      socketLog.value = [...socketLog.value, `delta:${payload.chunk}`]
      return
    }

    socketLog.value = [...socketLog.value, payload.message ? `${payload.type}:${payload.message}` : payload.type]
  }

  socket.onclose = () => {
    socketStatus.value = 'closed'
  }
}

function sendPrompt() {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectSocket()
    return
  }

  socket.send(
    JSON.stringify({
      type: 'chat.prompt',
      requestId: `prompt-${Date.now()}`,
      payload: {
        prompt: socketPrompt.value,
      },
    }),
  )
}

onMounted(() => {
  void checkHealth()
})

onUnmounted(() => {
  closeSse()
  closeSocket()
})
</script>

<template>
  <SectionShell
    title="SSE / WebSocket Playground"
    subtitle="这页把两种实时通信方式摆在一起。SSE 练单向流式响应，WebSocket 练双向消息和会话状态。"
  >
    <template #eyebrow>
      <span class="eyebrow">realtime</span>
    </template>

    <div class="transport-banner" :class="`is-${healthStatus}`">
      <strong>本地服务状态</strong>
      <span v-if="healthStatus === 'ready'">已连接到 `pnpm realtime:server`</span>
      <span v-else-if="healthStatus === 'checking'">正在检测 `http://127.0.0.1:4310`</span>
      <span v-else>还没启动，先运行 `pnpm realtime:server` 或 `pnpm dev:realtime`</span>
    </div>

    <div class="transport-grid">
      <article class="transport-card">
        <div class="transport-card__header">
          <div>
            <h3>SSE</h3>
            <p>适合 AI token 流、服务器单向推送、增量文本渲染。</p>
          </div>
          <span class="status-pill">{{ sseStatus }}</span>
        </div>

        <label class="field">
          <span>Topic</span>
          <input v-model="topic" type="text" />
        </label>

        <div class="actions">
          <button type="button" :disabled="!transportReady" @click="startSse">开始流式响应</button>
          <button type="button" class="ghost" @click="closeSse">关闭 SSE</button>
        </div>

        <div class="result-panel">
          <strong>Streaming Text</strong>
          <p>{{ sseText || '这里会看到服务端一段段推过来的 token。' }}</p>
        </div>

        <div class="meta-grid">
          <div>
            <span>Usage</span>
            <strong>{{ sseUsage || '等待 usage 事件' }}</strong>
          </div>
          <div>
            <span>事件数</span>
            <strong>{{ sseEvents.length }}</strong>
          </div>
        </div>

        <ul class="log-list">
          <li v-for="entry in sseEvents" :key="entry">{{ entry }}</li>
        </ul>
      </article>

      <article class="transport-card">
        <div class="transport-card__header">
          <div>
            <h3>WebSocket</h3>
            <p>适合双向会话、presence、工具调用确认、协同编辑。</p>
          </div>
          <span class="status-pill">{{ socketStatus }}</span>
        </div>

        <label class="field">
          <span>Prompt</span>
          <textarea v-model="socketPrompt" rows="4" />
        </label>

        <div class="actions">
          <button type="button" :disabled="!transportReady" @click="connectSocket">连接 WebSocket</button>
          <button type="button" :disabled="socketStatus !== 'connected'" @click="sendPrompt">发送 Prompt</button>
          <button type="button" class="ghost" @click="closeSocket">关闭连接</button>
        </div>

        <ul class="log-list">
          <li v-for="entry in socketLog" :key="entry">{{ entry }}</li>
        </ul>
      </article>
    </div>

    <div class="command-block">
      <strong>推荐启动方式</strong>
      <code>pnpm dev:realtime</code>
      <p>这条命令会同时启动 Vite、SSE/WebSocket 示例服务、Yjs 协同服务。</p>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(14, 116, 144, 0.12);
  color: #0f766e;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.transport-banner {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(122, 97, 80, 0.12);
  background: rgba(255, 255, 255, 0.78);
}

.transport-banner.is-ready {
  border-color: rgba(14, 116, 144, 0.18);
}

.transport-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}

.transport-card {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(122, 97, 80, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(245, 248, 250, 0.94));
}

.transport-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.transport-card__header h3,
.transport-card__header p,
.result-panel p {
  margin: 0;
}

.status-pill {
  display: inline-flex;
  align-self: start;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field input,
.field textarea {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: white;
  padding: 0.75rem 0.9rem;
  font: inherit;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.actions button {
  border: none;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  background: var(--accent);
  color: white;
  cursor: pointer;
}

.actions button.ghost {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-panel,
.command-block {
  display: grid;
  gap: 0.45rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.meta-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.meta-grid div {
  display: grid;
  gap: 0.2rem;
}

.meta-grid span {
  color: #475569;
  font-size: 0.9rem;
}

.log-list {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.45rem;
  color: #334155;
}

.command-block {
  margin-top: 1rem;
}

.command-block code {
  display: inline-flex;
  width: fit-content;
  padding: 0.3rem 0.55rem;
  border-radius: 0.6rem;
  background: #0f172a;
  color: #f8fafc;
}

@media (max-width: 720px) {
  .transport-banner,
  .transport-card__header {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
