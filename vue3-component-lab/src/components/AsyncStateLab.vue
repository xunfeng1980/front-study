<script setup lang="ts">
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'

type AsyncState = 'idle' | 'loading' | 'success' | 'error'

const state = ref<AsyncState>('idle')
const records = ref<string[]>([])
const errorMessage = ref('')

async function simulateRequest(result: 'success' | 'error') {
  state.value = 'loading'
  records.value = []
  errorMessage.value = ''

  await new Promise((resolve) => window.setTimeout(resolve, 900))

  if (result === 'error') {
    state.value = 'error'
    errorMessage.value = '模拟请求失败：请在组件里拆出 loading / error / empty 三种 UI。'
    return
  }

  state.value = 'success'
  records.value = ['DashboardCard.vue', 'FilterPanel.vue', 'MetricRibbon.vue']
}
</script>

<template>
  <SectionShell title="异步状态小样板" subtitle="你这部分基础已经够用了，所以这里只留一个最实用的 UI 状态模板，方便你以后写接口页面时直接套思路。">
    <template #eyebrow>
      <span class="eyebrow">async ui</span>
    </template>

    <div class="actions">
      <button type="button" @click="simulateRequest('success')">模拟成功</button>
      <button type="button" class="button-secondary" @click="simulateRequest('error')">
        模拟失败
      </button>
    </div>

    <div v-if="state === 'idle'" class="state-card">点击按钮，观察状态切换。</div>
    <div v-else-if="state === 'loading'" class="state-card state-card--loading">
      正在加载组件清单...
    </div>
    <div v-else-if="state === 'error'" class="state-card state-card--error">
      {{ errorMessage }}
    </div>
    <div v-else class="state-card state-card--success">
      <strong>请求成功</strong>
      <ul>
        <li v-for="record in records" :key="record">{{ record }}</li>
      </ul>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(58, 133, 153, 0.12);
  color: #2d6d7c;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.state-card {
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.state-card--loading {
  border-style: dashed;
}

.state-card--error {
  border-color: rgba(201, 79, 79, 0.22);
  background: rgba(250, 239, 239, 0.92);
  color: #8d2d2d;
}

.state-card--success strong {
  display: block;
  margin-bottom: 0.7rem;
}

.state-card ul {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.6rem;
}
</style>
