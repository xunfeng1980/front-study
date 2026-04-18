<script setup lang="ts">
import { computed, ref } from 'vue'
import MetricChip from './MetricChip.vue'
import SectionShell from './SectionShell.vue'
import UserBadge from './UserBadge.vue'

const members = ref([
  {
    id: 1,
    name: 'Lina',
    role: 'UI Architect',
    focus: '拆分筛选面板',
    tasks: 3,
    online: true,
  },
  {
    id: 2,
    name: 'Noah',
    role: 'Feature Engineer',
    focus: '封装表单字段',
    tasks: 2,
    online: true,
  },
  {
    id: 3,
    name: 'Iris',
    role: 'Design Partner',
    focus: '整理样式变量',
    tasks: 4,
    online: false,
  },
])

const onlineCount = computed(() => members.value.filter((member) => member.online).length)
const totalTasks = computed(() =>
  members.value.reduce((sum, member) => sum + member.tasks, 0),
)

function toggleMember(id: number) {
  members.value = members.value.map((member) =>
    member.id === id ? { ...member, online: !member.online } : member,
  )
}
</script>

<template>
  <SectionShell title="组件拆分训练场" subtitle="用父组件负责状态和列表，子组件负责展示与事件抛出。这里最值得反复看的是 props、emits 和 slot 的边界感。">
    <template #eyebrow>
      <span class="eyebrow">components</span>
    </template>

    <template #aside>
      <div class="metrics">
        <MetricChip label="在线成员" :value="onlineCount" tone="accent" />
        <MetricChip label="总任务数" :value="totalTasks" />
      </div>
    </template>

    <div class="playground-grid">
      <div class="concept-card">
        <h3>你要重点观察什么</h3>
        <ul>
          <li>父组件持有数据源，子组件只消费数据并通过事件回传意图。</li>
          <li>子组件越“笨”，越容易复用；复杂度尽量留在容器组件。</li>
          <li>先拆“责任”再拆“文件”，不要按视觉块机械切组件。</li>
        </ul>
      </div>

      <div class="member-list">
        <UserBadge
          v-for="member in members"
          :key="member.id"
          :member="member"
          @toggle="toggleMember"
        />
      </div>
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

.metrics {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.playground-grid {
  display: grid;
  grid-template-columns: minmax(16rem, 20rem) 1fr;
  gap: 1rem;
}

.concept-card {
  padding: 1.15rem;
  border-radius: 1.2rem;
  background: linear-gradient(180deg, rgba(242, 233, 221, 0.88), rgba(255, 250, 245, 0.96));
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.concept-card h3 {
  margin-top: 0;
}

.concept-card ul {
  margin: 0.9rem 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.75rem;
  color: var(--muted);
}

.member-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

@media (max-width: 860px) {
  .playground-grid {
    grid-template-columns: 1fr;
  }
}
</style>
