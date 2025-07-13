<template>
  <component :is="tag" :class="headingClasses">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: [Number, String],
    default: 1,
    validator: (value) => [1, 2, 3, 4, 5, 6].includes(Number(value))
  },
  size: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', '4xl', '3xl', '2xl', 'xl', 'lg', 'base'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'inverse'].includes(value)
  }
})

const tag = computed(() => `h${props.level}`)

const headingClasses = computed(() => {
  const baseClasses = []
  
  // Taille automatique selon le niveau si size="auto"
  const sizeToUse = props.size === 'auto' ? getSizeForLevel(props.level) : props.size
  
  // Styles de taille
  if (sizeToUse === '4xl') {
    baseClasses.push('text-4xl', 'font-bold')
  } else if (sizeToUse === '3xl') {
    baseClasses.push('text-3xl', 'font-bold')
  } else if (sizeToUse === '2xl') {
    baseClasses.push('text-2xl', 'font-bold')
  } else if (sizeToUse === 'xl') {
    baseClasses.push('text-xl', 'font-semibold')
  } else if (sizeToUse === 'lg') {
    baseClasses.push('text-lg', 'leading-6', 'font-medium')
  } else if (sizeToUse === 'base') {
    baseClasses.push('text-base', 'font-medium')
  } else {
    baseClasses.push('text-sm', 'font-medium')
  }
  
  // Couleur
  if (props.color === 'primary') {
    baseClasses.push('text-gray-900')
  } else if (props.color === 'secondary') {
    baseClasses.push('text-gray-600')
  } else if (props.color === 'accent') {
    baseClasses.push('text-indigo-600')
  } else if (props.color === 'inverse') {
    baseClasses.push('text-white')
  }
  
  return baseClasses.join(' ')
})

const getSizeForLevel = (level) => {
  const sizeMap = {
    1: '2xl',
    2: 'xl', 
    3: 'lg',
    4: 'base',
    5: 'sm',
    6: 'sm'
  }
  return sizeMap[Number(level)] || 'base'
}
</script>

<style scoped>
/* Styles spécifiques au composant Heading si nécessaire */
</style> 