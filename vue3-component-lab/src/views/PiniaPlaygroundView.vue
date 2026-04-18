<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SectionShell from '../components/SectionShell.vue'
import { studyModules } from '../data/modules'
import { useStudyLabStore } from '../stores/studyLab'

const studyLabStore = useStudyLabStore()
const { completedModules, completionRate, nextFocus, remainingModules, reviewQueue, sessionMinutes } =
  storeToRefs(studyLabStore)
</script>

<template>
  <SectionShell title="Pinia 练习台" subtitle="这里用一个全局学习进度 store 来练 state、getter、action。重点不是 API 多少，而是你能不能分清哪些数据该共享、哪些逻辑该集中管理。">
    <template #eyebrow>
      <span class="eyebrow">pinia</span>
    </template>

    <div class="store-grid">
      <div class="card">
        <h3>共享状态快照</h3>
        <dl class="stats">
          <div>
            <dt>累计学习时间</dt>
            <dd>{{ sessionMinutes }} 分钟</dd>
          </div>
          <div>
            <dt>完成进度</dt>
            <dd>{{ completionRate }}%</dd>
          </div>
          <div>
            <dt>下一关注点</dt>
            <dd>{{ nextFocus }}</dd>
          </div>
        </dl>
      </div>

      <div class="card">
        <h3>模块完成情况</h3>
        <div class="module-list">
          <label v-for="module in studyModules" :key="module.id" class="module-row">
            <input
              :checked="completedModules.includes(module.id)"
              type="checkbox"
              @change="studyLabStore.toggleCompleted(module.id)"
            />
            <span>{{ module.title }}</span>
          </label>
        </div>
      </div>

      <div class="card">
        <h3>Action 操作区</h3>
        <div class="actions">
          <button type="button" @click="studyLabStore.addSession()">再学 15 分钟</button>
          <button type="button" class="button-secondary" @click="studyLabStore.cycleReviewItem()">
            切换复习主题
          </button>
          <button type="button" class="button-secondary" @click="studyLabStore.resetProgress()">
            重置 store
          </button>
        </div>
      </div>

      <div class="card">
        <h3>当前复习队列</h3>
        <ul>
          <li v-for="item in reviewQueue" :key="item.id">
            <strong>{{ item.title }}</strong>
            <p>{{ item.note }}</p>
          </li>
        </ul>
      </div>

      <div class="card">
        <h3>剩余模块</h3>
        <ul>
          <li v-for="module in remainingModules" :key="module.id">
            {{ module.title }}：{{ module.description }}
          </li>
        </ul>
      </div>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(42, 109, 92, 0.12);
  color: #24584a;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.card h3 {
  margin-top: 0;
}

.stats,
.module-list,
.actions,
.card ul {
  display: grid;
  gap: 0.75rem;
}

.stats {
  margin: 0;
}

.stats div,
.module-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.stats dt,
.module-row span,
.card p {
  color: var(--muted);
}

.stats dd {
  margin: 0;
  font-weight: 700;
}

.module-row {
  padding: 0.75rem 0.85rem;
  border-radius: 0.9rem;
  background: rgba(249, 242, 235, 0.76);
}

.module-row input {
  width: 1rem;
  height: 1rem;
}

.card ul {
  margin: 0;
  padding-left: 1.1rem;
}

.card li strong {
  color: var(--ink);
}

.card li p {
  margin: 0.35rem 0 0;
}
</style>
