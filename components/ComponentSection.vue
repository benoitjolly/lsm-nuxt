<template>
  <div class="component-section">
    <div v-if="title || description" class="section-header">
      <div v-if="title" class="section-title">
        <h3 class="title">{{ title }}</h3>
      </div>
      <div v-if="description" class="section-description">
        <p class="description">{{ description }}</p>
      </div>
    </div>
    
    <div class="section-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped>
.component-section {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.section-header {
  padding: 1.5rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.section-title {
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-description {
  margin: 0;
}

.description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.section-content {
  padding: 2rem;
}
</style>