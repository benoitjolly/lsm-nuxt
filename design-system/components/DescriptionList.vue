<template>
  <dl class="description-list">
    <slot />
  </dl>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  divided: {
    type: Boolean,
    default: true
  },
  bordered: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
@media (min-width: 640px) {
  .description-list :deep(> div:not(:first-child)) {
    border-top: 1px solid #e5e7eb; /* border-gray-200 */
  }
}
</style> 