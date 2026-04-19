<script setup lang="ts">
type Member = {
  id: number
  name: string
  role: string
}

const props = defineProps<{
  // TODO: add a `member: Member` prop
}>()

const emit = defineEmits<{
  // TODO: add a `toggle: [id: number]` event
}>()

function handleToggle() {
  // TODO: emit the toggle event with props.member.id
}
</script>

<template>
  <article class="user-badge-exercise">
    <strong><!-- TODO: render props.member.name --></strong>
    <p><!-- TODO: render props.member.role --></p>
    <button type="button" @click="handleToggle">切换状态</button>
  </article>
</template>
