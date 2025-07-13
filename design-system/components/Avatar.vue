<template>
  <div :class="avatarClasses">
    <img 
      v-if="src && !imageError" 
      :src="src" 
      :alt="alt" 
      :class="imageClasses"
      @error="handleImageError"
    />
    <div v-else :class="fallbackClasses">
      <slot name="fallback">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="iconClasses">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['xs', 'sm', 'base', 'lg', 'xl'].includes(value)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'square'].includes(value)
  }
})

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

const sizeClasses = computed(() => {
  const sizeMap = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8', 
    base: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  return sizeMap[props.size]
})

const avatarClasses = computed(() => {
  const baseClasses = [
    'flex-shrink-0',
    sizeClasses.value
  ]
  
  return baseClasses.join(' ')
})

const imageClasses = computed(() => {
  const baseClasses = [
    sizeClasses.value,
    'object-cover'
  ]
  
  if (props.shape === 'circle') {
    baseClasses.push('rounded-full')
  } else {
    baseClasses.push('rounded-md')
  }
  
  return baseClasses.join(' ')
})

const fallbackClasses = computed(() => {
  const baseClasses = [
    sizeClasses.value,
    'bg-indigo-100',
    'flex',
    'items-center',
    'justify-center'
  ]
  
  if (props.shape === 'circle') {
    baseClasses.push('rounded-full')
  } else {
    baseClasses.push('rounded-md')
  }
  
  return baseClasses.join(' ')
})

const iconClasses = computed(() => {
  const iconSizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  }
  
  return `${iconSizeMap[props.size]} text-indigo-600`
})
</script>

<style scoped>
/* Styles spécifiques au composant Avatar */
</style> 