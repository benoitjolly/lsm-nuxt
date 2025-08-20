<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-4 py-5 sm:px-6">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" :class="contentClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="px-4 py-5 sm:px-6">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered'].includes(value)
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
  }
})

const cardClasses = computed(() => {
  const baseClasses = [
    'bg-white',
    'shadow',
    'overflow-hidden',
    'sm:rounded-lg'
  ]

  return baseClasses.join(' ')
})

const contentClasses = computed(() => {
  const baseClasses = []
  
  if (props.padding === 'none') {
    // Pas de padding
  } else if (props.padding === 'sm') {
    baseClasses.push('px-3', 'py-3')
  } else if (props.padding === 'lg') {
    baseClasses.push('px-6', 'py-6')
  } else {
    baseClasses.push('px-4', 'py-5', 'sm:px-6')
  }

  return baseClasses.join(' ')
})
</script>

<style scoped>
/* Styles spécifiques au composant Card si nécessaire */
</style> 