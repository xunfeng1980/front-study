<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionShell from '../components/SectionShell.vue'

type TopicId = 'overview' | 'guards' | 'state'
type PanelId = 'map' | 'notes'

const route = useRoute()
const router = useRouter()
const logs = ref<string[]>([])

const topics: Array<{ id: TopicId; title: string; description: string }> = [
  {
    id: 'overview',
    title: '路径参数',
    description: '用 params 表示资源身份，比如当前正在看的学习主题。',
  },
  {
    id: 'guards',
    title: '程序化跳转',
    description: '用 router.push 在交互事件里驱动页面跳转。',
  },
  {
    id: 'state',
    title: '查询参数',
    description: '用 query 表示 UI 状态，比如当前展开哪个面板。',
  },
]

const panels: Array<{ id: PanelId; title: string }> = [
  { id: 'map', title: '心智地图' },
  { id: 'notes', title: '实践笔记' },
]

const activeTopic = computed<TopicId>(() => {
  const topic = route.params.topic
  return typeof topic === 'string' && topics.some((item) => item.id === topic)
    ? (topic as TopicId)
    : 'overview'
})

const activePanel = computed<PanelId>(() => {
  const panel = route.query.panel
  return panel === 'notes' ? 'notes' : 'map'
})

const routeInsight = computed(() => {
  if (activePanel.value === 'map') {
    return 'params 更像 REST 资源定位，query 更像当前页面的视图状态。'
  }

  return '当你切换 query 时，组件通常不会卸载，适合做筛选、分页、tab。'
})

function navigateTopic(topic: TopicId) {
  router.push({
    name: 'router-lab',
    params: { topic },
    query: { panel: activePanel.value },
  })
}

function navigatePanel(panel: PanelId) {
  router.push({
    name: 'router-lab',
    params: { topic: activeTopic.value },
    query: { panel },
  })
}

watch(
  () => route.fullPath,
  (next, prev) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    logs.value = [
      `${timestamp}  route: ${prev ?? '(initial)'} -> ${next}`,
      ...logs.value,
    ].slice(0, 8)
  },
  { immediate: true },
)
</script>

<template>
  <SectionShell title="Vue Router 练习台" subtitle="现在这个训练场本身就已经变成了多页面应用。这里再额外做一个小实验，专门帮你区分 params、query 和程序化跳转。">
    <template #eyebrow>
      <span class="eyebrow">router</span>
    </template>

    <div class="router-grid">
      <div class="router-sidebar">
        <div class="card">
          <h3>学习主题</h3>
          <button
            v-for="topic in topics"
            :key="topic.id"
            type="button"
            class="route-button"
            :class="{ 'is-active': activeTopic === topic.id }"
            @click="navigateTopic(topic.id)"
          >
            {{ topic.title }}
          </button>
        </div>

        <div class="card">
          <h3>面板状态</h3>
          <button
            v-for="panel in panels"
            :key="panel.id"
            type="button"
            class="route-button route-button--secondary"
            :class="{ 'is-active': activePanel === panel.id }"
            @click="navigatePanel(panel.id)"
          >
            {{ panel.title }}
          </button>
        </div>
      </div>

      <div class="router-main">
        <div class="card card--highlight">
          <p class="route-path">{{ route.fullPath }}</p>
          <h3>{{ topics.find((topic) => topic.id === activeTopic)?.title }}</h3>
          <p>
            {{ topics.find((topic) => topic.id === activeTopic)?.description }}
          </p>
        </div>

        <div class="card">
          <h3>{{ activePanel === 'map' ? '路由心智地图' : '实践笔记' }}</h3>
          <p>{{ routeInsight }}</p>
          <ul v-if="activePanel === 'map'">
            <li>`/router/guards?panel=map`：topic 是业务主题，panel 是视图面板。</li>
            <li>地址栏变化意味着用户能刷新、收藏、分享当前视图。</li>
            <li>路由不是“换组件”的小技巧，而是页面状态的一部分。</li>
          </ul>
          <ul v-else>
            <li>搜索关键字、筛选条件、分页页码，通常适合放在 query。</li>
            <li>详情页主键、组织 id、slug，通常更适合放在 params。</li>
            <li>如果页面切换后逻辑复杂，优先先把 URL 设计清楚。</li>
          </ul>
        </div>

        <div class="card">
          <h3>路由变化日志</h3>
          <ul class="log-list">
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
  background: rgba(82, 91, 201, 0.12);
  color: #4047a7;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.router-grid {
  display: grid;
  grid-template-columns: minmax(14rem, 18rem) 1fr;
  gap: 1rem;
}

.router-sidebar,
.router-main {
  display: grid;
  gap: 1rem;
}

.card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.card--highlight {
  background: linear-gradient(180deg, rgba(238, 242, 255, 0.88), rgba(255, 255, 255, 0.92));
}

.card h3 {
  margin-top: 0;
}

.card ul {
  margin: 0.8rem 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.65rem;
}

.route-button {
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 0.65rem;
  border-radius: 1rem;
}

.route-button:last-child {
  margin-bottom: 0;
}

.route-button--secondary {
  color: var(--ink);
  background: rgba(246, 242, 255, 0.9);
}

.route-button.is-active {
  box-shadow: 0 16px 24px rgba(82, 91, 201, 0.18);
}

.route-path {
  margin: 0 0 0.75rem;
  font-family: var(--font-mono);
  color: var(--accent);
}

.log-list {
  font-family: var(--font-mono);
  color: var(--muted);
}

@media (max-width: 860px) {
  .router-grid {
    grid-template-columns: 1fr;
  }
}
</style>
