<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="section-shell">
    <header class="section-shell__header">
      <div>
        <slot name="eyebrow" />
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
      </div>
      <div class="section-shell__aside">
        <slot name="aside" />
      </div>
    </header>

    <div class="section-shell__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section-shell {
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: rgba(255, 250, 245, 0.86);
  border: 1px solid rgba(122, 97, 80, 0.12);
  box-shadow: 0 22px 40px rgba(61, 39, 24, 0.08);
}

.section-shell__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-shell__header h2 {
  margin: 0.2rem 0 0.5rem;
  font-size: 1.35rem;
}

.section-shell__header p {
  margin: 0;
  max-width: 46rem;
  color: var(--muted);
}

.section-shell__aside {
  display: flex;
  align-items: flex-start;
}

@media (max-width: 860px) {
  .section-shell {
    padding: 1.1rem;
  }

  .section-shell__header {
    flex-direction: column;
  }
}
</style>
