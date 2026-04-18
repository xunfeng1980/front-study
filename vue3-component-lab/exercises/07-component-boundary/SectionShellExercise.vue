<script setup lang="ts">
const props = defineProps<{
  // TODO: add `title: string`
  // TODO: add `subtitle: string`
}>()
</script>

<template>
  <section class="section-shell-exercise">
    <header class="section-shell-exercise__header">
      <div>
        <h2><!-- TODO: render props.title --></h2>
        <p><!-- TODO: render props.subtitle --></p>
      </div>

      <div class="section-shell-exercise__actions">
        <!-- TODO: render the named slot `headerActions` -->
      </div>
    </header>

    <div class="section-shell-exercise__body">
      <!-- TODO: render the default slot -->
    </div>
  </section>
</template>
