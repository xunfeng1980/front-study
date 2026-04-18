<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LifecycleChild from './LifecycleChild.vue'
import SectionShell from './SectionShell.vue'

const showChild = ref(true)
const childMessage = ref('初始化 props')
const logs = ref<string[]>([])

function appendLog(message: string) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  logs.value = [`${timestamp}  ${message}`, ...logs.value].slice(0, 12)
}

function mutateMessage() {
  childMessage.value = `props 更新于 ${new Date().toLocaleTimeString('zh-CN', {
    hour12: false,
  })}`
}

onMounted(() => appendLog('parent -> onMounted'))

watch(showChild, (next) => {
  appendLog(`parent -> watch(showChild): ${next ? 'mount child' : 'unmount child'}`)
})

watch(childMessage, (next, prev) => {
  appendLog(`parent -> watch(childMessage): "${prev ?? 'undefined'}" => "${next}"`)
})
</script>

<template>
  <SectionShell title="生命周期观察台" subtitle="这里专门用来感受 mount、update、unmount 的触发时机。你可以反复点击按钮，看父子组件日志如何交错出现。">
    <template #eyebrow>
      <span class="eyebrow">lifecycle</span>
    </template>

    <div class="lifecycle-layout">
      <div class="control-panel">
        <button type="button" @click="showChild = !showChild">
          {{ showChild ? '卸载子组件' : '重新挂载子组件' }}
        </button>
        <button type="button" @click="mutateMessage">修改 props</button>
        <button type="button" class="button-secondary" @click="logs = []">清空日志</button>

        <div class="tips">
          <h3>推荐观察顺序</h3>
          <ol>
            <li>先点击“修改 props”，看 watch 和 update 的顺序。</li>
            <li>再点击“卸载子组件”，看 unmount 前后钩子。</li>
            <li>最后重新挂载，对比 immediate watch 的首次执行。</li>
          </ol>
        </div>
      </div>

      <div class="stage-panel">
        <LifecycleChild
          v-if="showChild"
          :message="childMessage"
          @log="appendLog"
        />
        <div v-else class="empty-state">子组件当前已卸载</div>

        <div class="log-panel">
          <h3>日志窗口</h3>
          <ul>
            <li v-for="entry in logs" :key="entry">{{ entry }}</li>
          </ul>
        </div>
      </div>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(188, 107, 45, 0.12);
  color: #8f4e1f;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.lifecycle-layout {
  display: grid;
  grid-template-columns: minmax(16rem, 20rem) 1fr;
  gap: 1rem;
}

.control-panel,
.stage-panel {
  display: grid;
  gap: 0.9rem;
}

.tips,
.log-panel,
.empty-state {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.tips h3,
.log-panel h3 {
  margin-top: 0;
}

.tips ol,
.log-panel ul {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.65rem;
}

.log-panel ul {
  max-height: 17rem;
  overflow: auto;
  font-family: var(--font-mono);
  color: var(--muted);
}

.empty-state {
  min-height: 8rem;
  display: grid;
  place-items: center;
  color: var(--muted);
}

@media (max-width: 860px) {
  .lifecycle-layout {
    grid-template-columns: 1fr;
  }
}
</style>
