<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { studyModules, studySteps } from './data/modules'
import { useStudyLabStore } from './stores/studyLab'

const route = useRoute()
const studyLabStore = useStudyLabStore()

const currentModule = computed(
  () =>
    studyModules.find((module) => module.id === route.meta.moduleId) ?? studyModules[0],
)

const currentStep = computed(() =>
  studySteps.find((step) => step.path === route.path || route.path.startsWith(`${step.path}/`)),
)

const isCurrentCompleted = computed(() =>
  studyLabStore.completedModules.includes(currentModule.value.id),
)
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <p class="sidebar__eyebrow">Vue 3 + Vite</p>
      <h1>前端专项训练场</h1>
      <p class="sidebar__intro">
        现在不要自己决定学什么，直接按 1、2、3、4 往下走。先把核心直觉练出来，
        再碰应用级结构。
      </p>

      <div class="study-roadmap">
        <h2>推荐路线</h2>
        <RouterLink
          v-for="step in studySteps"
          :key="step.step"
          v-slot="{ href, navigate }"
          :to="step.path"
          custom
        >
          <a :href="href" class="study-roadmap__item" @click="navigate">
            <span>0{{ step.step }}</span>
            <div>
              <strong>{{ step.title }}</strong>
              <small>{{ step.goal }}</small>
            </div>
          </a>
        </RouterLink>
      </div>

      <nav class="module-nav" aria-label="学习模块">
        <RouterLink
          v-for="module in studyModules"
          :key="module.id"
          v-slot="{ href, isActive, navigate }"
          :to="module.path"
          custom
        >
          <a
            :href="href"
            class="module-nav__item"
            :class="{ 'is-active': isActive }"
            @click="navigate"
          >
            <strong>{{ module.title }}</strong>
            <span>{{ module.description }}</span>
          </a>
        </RouterLink>
      </nav>

      <div class="store-snapshot">
        <h2>全局学习进度</h2>
        <div class="snapshot-grid">
          <div>
            <span>完成模块</span>
            <strong>{{ studyLabStore.completedCount }} / {{ studyModules.length }}</strong>
          </div>
          <div>
            <span>完成率</span>
            <strong>{{ studyLabStore.completionRate }}%</strong>
          </div>
          <div>
            <span>下一关注点</span>
            <strong>{{ studyLabStore.nextFocus }}</strong>
          </div>
        </div>
        <button type="button" @click="studyLabStore.toggleCompleted(currentModule.id)">
          {{ isCurrentCompleted ? '取消当前模块完成' : '标记当前模块完成' }}
        </button>
      </div>

      <div class="study-path">
        <h2>建议学习顺序</h2>
        <ol>
          <li>先练组件拆分和生命周期，建立状态变化的直觉。</li>
          <li>再攻 CSS，把布局、留白和状态样式练熟。</li>
          <li>然后看 Router 和 Pinia，把单组件思维扩展到应用级结构。</li>
        </ol>
      </div>
    </aside>

    <main class="content">
      <section class="hero-card">
        <p class="hero-card__eyebrow">给后端架构师的前端切入点</p>
        <div class="hero-card__header">
          <div>
            <h2>{{ currentStep ? `第 ${currentStep.step} 步：${currentStep.title}` : currentModule.title }}</h2>
            <p>{{ currentStep?.goal ?? currentModule.description }}</p>
          </div>
          <div class="hero-card__note">
            <span>{{ currentStep ? '当前阶段' : '当前路径' }}</span>
            <strong>{{ currentStep ? `0${currentStep.step}` : route.fullPath }}</strong>
          </div>
        </div>
      </section>

      <RouterView />
    </main>
  </div>
</template>
