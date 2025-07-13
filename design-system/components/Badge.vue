<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['sm', 'base', 'lg'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-semibold',
    'rounded-full'
  ]
  
  // Variantes de couleur
  if (props.variant === 'primary') {
    baseClasses.push('bg-blue-100', 'text-blue-800')
  } else if (props.variant === 'secondary') {
    baseClasses.push('bg-gray-100', 'text-gray-800')
  } else if (props.variant === 'success') {
    baseClasses.push('bg-green-100', 'text-green-800')
  } else if (props.variant === 'warning') {
    baseClasses.push('bg-yellow-100', 'text-yellow-800')
  } else if (props.variant === 'error') {
    baseClasses.push('bg-red-100', 'text-red-800')
  } else if (props.variant === 'info') {
    baseClasses.push('bg-indigo-100', 'text-indigo-800')
  }
  
  // Tailles
  if (props.size === 'sm') {
    baseClasses.push('px-2', 'py-1', 'text-xs', 'leading-4')
  } else if (props.size === 'base') {
    baseClasses.push('px-2', 'text-xs', 'leading-5')
  } else if (props.size === 'lg') {
    baseClasses.push('px-3', 'py-1', 'text-sm', 'leading-5')
  }
  
  return baseClasses.join(' ')
})
</script>

<style scoped>
/* Styles spécifiques au composant Badge */
</style> 