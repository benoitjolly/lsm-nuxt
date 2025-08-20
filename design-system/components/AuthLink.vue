<template>
  <NuxtLink
    :to="to"
    class="auth-link"
  >
    <slot />
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.auth-link {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.5;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  color: #4f46e5; /* primary-600 */
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.auth-link:hover {
  color: #4338ca; /* primary-700 */
}
</style> 