<template>
  <div class="tabs-container">
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'tab-button',
          { 'tab-button-active': modelValue === tab.id }
        ]"
        @click="$emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tabs-content">
      <slot :activeTab="modelValue" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => tab.id && tab.label)
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-nav {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: #6b7280;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.tab-button:hover {
  color: #374151;
  background-color: #f9fafb;
}

.tab-button-active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background-color: #eff6ff;
}

.tab-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.tabs-content {
  min-height: 200px;
}
</style>