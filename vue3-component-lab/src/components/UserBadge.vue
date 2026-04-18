<script setup lang="ts">
const props = defineProps<{
  member: {
    id: number
    name: string
    role: string
    focus: string
    tasks: number
    online: boolean
  }
}>()

const emit = defineEmits<{
  toggle: [id: number]
}>()

function handleToggle() {
  emit('toggle', props.member.id)
}
</script>

<template>
  <article class="user-badge" :class="{ 'user-badge--offline': !member.online }">
    <div class="user-badge__top">
      <div>
        <strong>{{ member.name }}</strong>
        <p>{{ member.role }}</p>
      </div>
      <span class="status-dot" :class="{ 'status-dot--online': member.online }" />
    </div>

    <dl class="user-badge__meta">
      <div>
        <dt>当前聚焦</dt>
        <dd>{{ member.focus }}</dd>
      </div>
      <div>
        <dt>进行中任务</dt>
        <dd>{{ member.tasks }}</dd>
      </div>
    </dl>

    <button type="button" @click="handleToggle">
      {{ member.online ? '切换为离线' : '切换为在线' }}
    </button>
  </article>
</template>

<style scoped>
.user-badge {
  padding: 1rem;
  border-radius: 1.1rem;
  background: #fff;
  border: 1px solid rgba(122, 97, 80, 0.12);
  display: grid;
  gap: 1rem;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.user-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(61, 39, 24, 0.08);
  border-color: rgba(42, 109, 92, 0.3);
}

.user-badge--offline {
  background: rgba(251, 244, 237, 0.76);
}

.user-badge__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.user-badge strong {
  display: block;
  font-size: 1rem;
}

.user-badge p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.status-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 999px;
  background: #c94f4f;
}

.status-dot--online {
  background: #2a6d5c;
}

.user-badge__meta {
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.user-badge__meta div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.95rem;
}

.user-badge__meta dt {
  color: var(--muted);
}

.user-badge__meta dd {
  margin: 0;
  color: var(--ink);
  font-weight: 600;
}

.user-badge button {
  justify-self: flex-start;
}
</style>
