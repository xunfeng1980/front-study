<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  tone?: 'neutral' | 'accent'
}>()
</script>

<template>
  <div class="metric-chip" :class="`metric-chip--${tone ?? 'neutral'}`">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
  </div>
</template>

<style scoped>
.metric-chip {
  min-width: 8rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid transparent;
}

.metric-chip span {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.metric-chip strong {
  display: block;
  margin-top: 0.45rem;
  font-size: 1.05rem;
  color: var(--ink);
}

.metric-chip--neutral {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(122, 97, 80, 0.12);
}

.metric-chip--accent {
  background: rgba(42, 109, 92, 0.12);
  border-color: rgba(42, 109, 92, 0.2);
}
</style>
