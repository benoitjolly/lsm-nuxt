<template>
  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="separator-text">
          <slot />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Pas de props nécessaires pour ce composant
</script>

<style scoped>
.separator-text {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  color: #6b7280; /* neutral-500 */
  background-color: #f9fafb; /* neutral-50 */
  padding: 0 0.5rem;
}
</style> 