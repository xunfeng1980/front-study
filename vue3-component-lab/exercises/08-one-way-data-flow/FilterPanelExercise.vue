<script setup lang="ts">
type Option = {
  label: string
  value: string
}

const props = defineProps<{
  // TODO: add `query: string`
  // TODO: add `selectedTag: string`
  // TODO: add `options: Option[]`
}>()

const emit = defineEmits<{
  // TODO: add `update:query: [value: string]`
  // TODO: add `update:tag: [value: string]`
}>()

function handleQueryChange(value: string) {
  // TODO: emit `update:query` with value
}

function handleTagChange(value: string) {
  // TODO: emit `update:tag` with value
}
</script>

<template>
  <section class="filter-panel-exercise">
    <input
      :value="props.query"
      placeholder="搜索任务"
      @input="handleQueryChange(($event.target as HTMLInputElement).value)"
    />

    <select
      :value="props.selectedTag"
      @change="handleTagChange(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </section>
</template>
