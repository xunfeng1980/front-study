<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionShell from './SectionShell.vue'

const layoutMode = ref<'grid' | 'stack'>('grid')
const density = ref<'cozy' | 'compact'>('cozy')
const activeCard = ref(1)

const cards = [
  {
    id: 1,
    title: '卡片布局',
    description: '练 flex、grid 和 gap，不要一上来就堆 margin。',
  },
  {
    id: 2,
    title: '状态样式',
    description: '把 hover、active、selected 当成状态机来写。',
  },
  {
    id: 3,
    title: '层级与留白',
    description: '用字号、行高、间距建立信息层级，而不是到处加粗。',
  },
]

const boardClass = computed(() => [
  `board--${layoutMode.value}`,
  `board--${density.value}`,
])
</script>

<template>
  <SectionShell title="CSS 练习台" subtitle="你当前最薄弱的是 CSS，所以这里尽量做成可调、可比、可拆。先观察 class 变化，再去看 scoped style 里的选择器。">
    <template #eyebrow>
      <span class="eyebrow">css</span>
    </template>

    <div class="toolbar">
      <div class="segmented">
        <button type="button" :class="{ 'is-active': layoutMode === 'grid' }" @click="layoutMode = 'grid'">
          Grid
        </button>
        <button type="button" :class="{ 'is-active': layoutMode === 'stack' }" @click="layoutMode = 'stack'">
          Stack
        </button>
      </div>

      <div class="segmented">
        <button type="button" :class="{ 'is-active': density === 'cozy' }" @click="density = 'cozy'">
          Cozy
        </button>
        <button type="button" :class="{ 'is-active': density === 'compact' }" @click="density = 'compact'">
          Compact
        </button>
      </div>
    </div>

    <div class="board" :class="boardClass">
      <article
        v-for="card in cards"
        :key="card.id"
        class="practice-card"
        :class="{ 'practice-card--active': activeCard === card.id }"
        @click="activeCard = card.id"
      >
        <span class="practice-card__index">0{{ card.id }}</span>
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </article>
    </div>

    <div class="css-notes">
      <div>
        <strong>建议你怎么练</strong>
        <p>先改容器布局类，再改卡片状态类，最后尝试自己加一个媒体查询。</p>
      </div>
      <div>
        <strong>这段代码重点</strong>
        <p>同一份数据，在不同 class 组合下呈现不同布局，这就是 CSS 的威力。</p>
      </div>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(89, 87, 214, 0.12);
  color: #4340a6;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-bottom: 1.1rem;
}

.segmented {
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.segmented button {
  border: 0;
  background: transparent;
  color: var(--muted);
}

.segmented .is-active {
  background: rgba(42, 109, 92, 0.14);
  color: #24584a;
}

.board {
  display: grid;
  gap: 1rem;
}

.board--grid {
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
}

.board--stack {
  grid-template-columns: 1fr;
}

.board--cozy .practice-card {
  padding: 1.35rem;
}

.board--compact .practice-card {
  padding: 0.95rem;
}

.practice-card {
  border-radius: 1.15rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 242, 235, 0.96));
  border: 1px solid rgba(122, 97, 80, 0.12);
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.practice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(61, 39, 24, 0.08);
}

.practice-card--active {
  border-color: rgba(42, 109, 92, 0.32);
  box-shadow: 0 24px 34px rgba(42, 109, 92, 0.14);
}

.practice-card__index {
  display: inline-flex;
  margin-bottom: 0.85rem;
  font-family: var(--font-mono);
  color: var(--muted);
}

.practice-card h3 {
  margin: 0 0 0.55rem;
}

.practice-card p {
  margin: 0;
  color: var(--muted);
}

.css-notes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.css-notes div {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.css-notes p {
  margin: 0.55rem 0 0;
  color: var(--muted);
}
</style>
