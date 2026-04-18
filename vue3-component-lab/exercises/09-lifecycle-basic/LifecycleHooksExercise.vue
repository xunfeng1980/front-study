<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  log: [message: string]
}>()

// TODO: import and register onMounted
// TODO: import and register onBeforeUnmount
// TODO: import and register onUnmounted
// TODO: add a watch for props.message with { immediate: true }
// TODO: emit these exact log messages:
// child -> onMounted
// child -> onBeforeUnmount
// child -> onUnmounted
// child -> watch(message)
</script>

<template>
  <section class="lifecycle-exercise">
    <p>{{ props.message }}</p>
  </section>
</template>
