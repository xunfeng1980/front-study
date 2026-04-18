<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const ticks = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

// TODO: in onMounted, start a timer that increments ticks.value every 1000ms
// TODO: in onUnmounted, clear the timer if it exists
</script>

<template>
  <section class="polling-cleanup-exercise">
    <p>{{ ticks }}</p>
  </section>
</template>
