<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionShell from '../components/SectionShell.vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

type TodoSnapshot = {
  id: string
  text: string
  done: boolean
}

type AwarenessUser = {
  name: string
  color: string
}

const collabServerUrl = 'ws://127.0.0.1:1234'
const route = useRoute()
const router = useRouter()

const roomDraft = ref(
  typeof route.query.room === 'string' && route.query.room.trim()
    ? route.query.room
    : 'front-study-collab',
)
const activeRoom = ref(roomDraft.value)
const localName = ref(`User-${Math.floor(Math.random() * 90 + 10)}`)
const newTodo = ref('')
const connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('disconnected')
const synced = ref(false)
const todos = ref<TodoSnapshot[]>([])
const viewers = ref<AwarenessUser[]>([])

let doc: Y.Doc | null = null
let provider: WebsocketProvider | null = null
let todosArray: Y.Array<Y.Map<unknown>> | null = null
let deepObserver: (() => void) | null = null

function buildTodoId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function pickUserColor(name: string) {
  const palette = ['#0f766e', '#2563eb', '#db2777', '#7c3aed', '#ea580c']
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  return palette[sum % palette.length]
}

function syncTodos() {
  if (!todosArray) {
    todos.value = []
    return
  }

  todos.value = todosArray.toArray().map((entry, index) => ({
    id: String(entry.get('id') ?? `todo-${index}`),
    text: String(entry.get('text') ?? ''),
    done: Boolean(entry.get('done')),
  }))
}

function syncViewers() {
  if (!provider) {
    viewers.value = []
    return
  }

  viewers.value = Array.from(provider.awareness.getStates().values())
    .map((state) => state.user as AwarenessUser | undefined)
    .filter((value): value is AwarenessUser => Boolean(value))
}

function cleanup() {
  if (todosArray && deepObserver) {
    todosArray.unobserveDeep(deepObserver)
  }

  if (provider) {
    provider.awareness.off('change', syncViewers)
    provider.destroy()
    provider = null
  }

  doc?.destroy()
  doc = null
  todosArray = null
  deepObserver = null
  todos.value = []
  viewers.value = []
  synced.value = false
  connectionStatus.value = 'disconnected'
}

function connectToRoom(room: string) {
  cleanup()

  activeRoom.value = room
  doc = new Y.Doc()
  provider = new WebsocketProvider(collabServerUrl, room, doc)
  todosArray = doc.getArray<Y.Map<unknown>>('todos')

  deepObserver = () => {
    syncTodos()
  }

  todosArray.observeDeep(deepObserver)
  provider.on('status', (event) => {
    connectionStatus.value = event.status as typeof connectionStatus.value
  })
  provider.on('sync', (value: boolean) => {
    synced.value = value
    syncTodos()
  })
  provider.awareness.on('change', syncViewers)
  provider.awareness.setLocalStateField('user', {
    name: localName.value,
    color: pickUserColor(localName.value),
  })

  syncTodos()
  syncViewers()
}

function joinRoom() {
  const normalized = roomDraft.value.trim() || 'front-study-collab'
  roomDraft.value = normalized
  void router.replace({
    query: {
      ...route.query,
      room: normalized,
    },
  })
  connectToRoom(normalized)
}

function addTodo() {
  const text = newTodo.value.trim()

  if (!text || !doc || !todosArray) {
    return
  }

  doc.transact(() => {
    const entry = new Y.Map<unknown>()
    entry.set('id', buildTodoId())
    entry.set('text', text)
    entry.set('done', false)
    todosArray?.push([entry])
  })

  newTodo.value = ''
}

function toggleTodo(id: string) {
  if (!doc || !todosArray) {
    return
  }

  const entry = todosArray.toArray().find((item) => item.get('id') === id)

  if (!entry) {
    return
  }

  doc.transact(() => {
    entry.set('done', !Boolean(entry.get('done')))
  })
}

function removeTodo(id: string) {
  if (!doc || !todosArray) {
    return
  }

  const index = todosArray.toArray().findIndex((item) => item.get('id') === id)

  if (index < 0) {
    return
  }

  doc.transact(() => {
    todosArray?.delete(index, 1)
  })
}

const remainingCount = computed(() => todos.value.filter((item) => !item.done).length)
const shareUrl = computed(() => {
  const origin = typeof window === 'undefined' ? 'http://localhost:5173' : window.location.origin
  return `${origin}/collab-todos?room=${encodeURIComponent(activeRoom.value)}`
})

watch(localName, (value) => {
  provider?.awareness.setLocalStateField('user', {
    name: value,
    color: pickUserColor(value),
  })
})

watch(
  () => route.query.room,
  (value) => {
    if (typeof value === 'string' && value && value !== activeRoom.value) {
      roomDraft.value = value
      connectToRoom(value)
    }
  },
)

onMounted(() => {
  connectToRoom(activeRoom.value)
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <SectionShell
    title="Collaborative Todo with WebSocket + Yjs"
    subtitle="这是最后的综合示例：共享文档、presence、多人同时勾选和删除任务。开两个浏览器窗口，用同一个 room 就能看到协同效果。"
  >
    <template #eyebrow>
      <span class="eyebrow">collaboration</span>
    </template>

    <div class="collab-banner">
      <div>
        <strong>连接状态</strong>
        <span>{{ connectionStatus }} / sync: {{ synced ? 'ready' : 'pending' }}</span>
      </div>
      <div>
        <strong>协作者</strong>
        <span>{{ viewers.length }}</span>
      </div>
      <div>
        <strong>剩余 Todo</strong>
        <span>{{ remainingCount }}</span>
      </div>
    </div>

    <div class="collab-grid">
      <article class="panel">
        <h3>Room</h3>

        <label class="field">
          <span>Room Name</span>
          <input v-model="roomDraft" type="text" />
        </label>

        <label class="field">
          <span>Your Name</span>
          <input v-model="localName" type="text" />
        </label>

        <div class="actions">
          <button type="button" @click="joinRoom">切换 Room</button>
        </div>

        <label class="field">
          <span>Share URL</span>
          <input :value="shareUrl" readonly type="text" />
        </label>

        <div class="presence-list">
          <div v-for="viewer in viewers" :key="`${viewer.name}-${viewer.color}`" class="presence-chip">
            <span :style="{ background: viewer.color }" class="presence-dot" />
            {{ viewer.name }}
          </div>
        </div>
      </article>

      <article class="panel">
        <h3>Todo List</h3>

        <div class="todo-entry">
          <input
            v-model="newTodo"
            type="text"
            placeholder="Add a shared todo"
            @keydown.enter.prevent="addTodo"
          />
          <button type="button" @click="addTodo">添加</button>
        </div>

        <ul class="todo-list">
          <li v-for="item in todos" :key="item.id" class="todo-item">
            <label>
              <input :checked="item.done" type="checkbox" @change="toggleTodo(item.id)" />
              <span :class="{ 'is-done': item.done }">{{ item.text }}</span>
            </label>
            <button type="button" class="ghost" @click="removeTodo(item.id)">删除</button>
          </li>
        </ul>

        <p v-if="todos.length === 0" class="empty-state">
          当前 room 还没有任务。开两个窗口一起添加，你会很快感受到 Yjs 的同步效果。
        </p>
      </article>
    </div>

    <div class="command-block">
      <strong>启动协同服务</strong>
      <code>pnpm collab:server</code>
      <p>或者直接运行 `pnpm dev:realtime`，一次把 Vite、实时通信服务、Yjs 协同服务都拉起来。</p>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(42, 109, 92, 0.14);
  color: #24584a;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.collab-banner {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
}

.collab-banner div,
.panel,
.command-block {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.collab-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
}

.panel h3,
.empty-state {
  margin: 0;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field input {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: white;
  padding: 0.75rem 0.9rem;
  font: inherit;
}

.actions,
.todo-entry {
  display: flex;
  gap: 0.7rem;
}

.actions button,
.todo-entry button {
  border: none;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  background: var(--accent);
  color: white;
  cursor: pointer;
}

.todo-entry input {
  flex: 1;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: white;
  padding: 0.75rem 0.9rem;
  font: inherit;
}

.presence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.presence-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
}

.presence-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0.95rem;
  border-radius: 0.9rem;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.todo-item label {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}

.todo-item .ghost {
  border: none;
  border-radius: 999px;
  padding: 0.52rem 0.8rem;
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.is-done {
  color: #64748b;
  text-decoration: line-through;
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

@media (max-width: 900px) {
  .collab-grid {
    grid-template-columns: 1fr;
  }

  .todo-item {
    align-items: start;
    flex-direction: column;
  }
}
</style>
