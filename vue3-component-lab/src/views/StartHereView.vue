<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SectionShell from '../components/SectionShell.vue'
import { studySteps } from '../data/modules'
</script>

<template>
  <SectionShell title="从这里开始" subtitle="你不用自己决定先学哪个模块。就按 1、2、3、4 往下走，每一步只盯一个重点。">
    <template #eyebrow>
      <span class="eyebrow">start</span>
    </template>

    <div class="start-grid">
      <article v-for="item in studySteps" :key="item.step" class="step-card">
        <div class="step-card__header">
          <span class="step-number">0{{ item.step }}</span>
          <h3>{{ item.title }}</h3>
        </div>

        <p class="step-goal">{{ item.goal }}</p>

        <ul>
          <li v-for="task in item.tasks" :key="task">{{ task }}</li>
        </ul>

        <RouterLink v-slot="{ href, navigate }" :to="item.path" custom>
          <a :href="href" class="step-link" @click="navigate">
            进入第 {{ item.step }} 步
          </a>
        </RouterLink>
      </article>
    </div>

    <div class="start-note">
      <strong>建议你今天只做一件事</strong>
      <p>先完成第 1 步和第 2 步，不着急碰 Router 和 Pinia。你现在最值钱的是先把组件边界和运行时直觉练出来。</p>
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

.start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.step-card {
  display: grid;
  gap: 0.9rem;
  padding: 1.15rem;
  border-radius: 1.2rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 242, 235, 0.96));
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.step-card__header {
  display: grid;
  gap: 0.45rem;
}

.step-card__header h3 {
  margin: 0;
}

.step-number {
  display: inline-flex;
  width: fit-content;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  color: var(--accent);
  background: rgba(42, 109, 92, 0.1);
}

.step-goal {
  margin: 0;
}

.step-card ul {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.65rem;
}

.step-link {
  display: inline-flex;
  justify-self: start;
  padding: 0.72rem 1.05rem;
  border-radius: 999px;
  color: var(--panel-strong);
  background: var(--accent);
}

.start-note {
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.start-note p {
  margin: 0.45rem 0 0;
}
</style>
