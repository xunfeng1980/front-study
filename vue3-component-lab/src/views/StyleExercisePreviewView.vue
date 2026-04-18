<script setup lang="ts">
import '../../exercises/03-css-layout/dashboard-card.css'
import '../../exercises/04-css-animation/fade-up.css'
import '../../exercises/05-sass/profile-panel.scss'
import SectionShell from '../components/SectionShell.vue'
import { buildCardClasses } from '../../exercises/06-tailwindcss/buildCardClasses'
import { buildStatusBadgeClasses } from '../../exercises/06-tailwindcss/buildStatusBadgeClasses'

const tailwindCardClasses = buildCardClasses(true)
const tailwindBadgeClasses = buildStatusBadgeClasses('online')
</script>

<template>
  <SectionShell
    title="Style Preview"
    subtitle="这个页面专门给 Playwright UI test 用。CSS、Sass、Tailwind 练习改完后，可以来这里看真实渲染结果。"
  >
    <template #eyebrow>
      <span class="eyebrow">ui test</span>
    </template>

    <div class="preview-stack">
      <section>
        <h3>Plain CSS</h3>
        <div class="dashboard-grid" data-testid="css-grid">
          <article class="dashboard-card dashboard-card--active" data-testid="css-card-active">
            Active dashboard card
          </article>
          <article class="dashboard-card">Second card</article>
          <article class="dashboard-card">Third card</article>
        </div>
      </section>

      <section>
        <h3>Sass Panel</h3>
        <article class="profile-panel" data-testid="sass-panel">
          <div class="profile-panel__meta">
            <strong>Frontend Skill Track</strong>
            <p>Sass variables, nesting and mixins</p>
          </div>
          <button class="profile-panel__cta" type="button">Review panel</button>
        </article>
      </section>

      <section>
        <h3>Tailwind Card</h3>
        <article :class="tailwindCardClasses" data-testid="tailwind-card">
          <div class="flex items-center justify-between gap-3">
            <strong class="text-base font-semibold text-slate-900">Tailwind Utility Card</strong>
            <span :class="tailwindBadgeClasses" data-testid="tailwind-badge">online</span>
          </div>
          <p class="mt-3 text-sm text-slate-600">
            Utility classes will be checked from a headless browser.
          </p>
        </article>
      </section>
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

.preview-stack {
  display: grid;
  gap: 1.5rem;
}

.preview-stack section h3 {
  margin-top: 0;
}
</style>
