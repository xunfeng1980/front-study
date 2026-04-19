<script setup lang="ts">
const query = ref('')

// TODO: use `useAsyncData('todos', () => $fetch('/api/todos'))`
// TODO: call `useTodoFilter`
// TODO: expose `pending`, `error`, and `filteredTodos`
</script>

<template>
  <section class="nuxt-todo-page">
    <input v-model="query" placeholder="搜索 todo" />

    <!-- TODO: when pending, render `加载中...` -->
    <!-- TODO: when error, render `加载失败` -->
    <!-- TODO: otherwise render the todo list -->
  </section>
</template>
