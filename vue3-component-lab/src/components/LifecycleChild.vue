<script setup lang="ts">
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  watch,
} from 'vue'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  log: [message: string]
}>()

const innerCount = ref(0)

function log(message: string) {
  emit('log', message)
}

onBeforeMount(() => log('child -> onBeforeMount'))
onMounted(() => log('child -> onMounted'))
onBeforeUpdate(() => log('child -> onBeforeUpdate'))
onUpdated(() => log('child -> onUpdated'))
onBeforeUnmount(() => log('child -> onBeforeUnmount'))
onUnmounted(() => log('child -> onUnmounted'))

watch(
  () => props.message,
  (next, prev) => {
    log(`child -> watch(message): "${prev ?? 'undefined'}" => "${next}"`)
  },
  { immediate: true },
)
</script>

<template>
  <div class="lifecycle-child">
    <p>子组件接收到的 message：</p>
    <strong>{{ message }}</strong>

    <button type="button" @click="innerCount += 1">
      触发一次子组件内部更新 {{ innerCount }}
    </button>
  </div>
</template>

<style scoped>
.lifecycle-child {
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px dashed rgba(42, 109, 92, 0.28);
}

.lifecycle-child p,
.lifecycle-child strong {
  margin: 0;
}
</style>
