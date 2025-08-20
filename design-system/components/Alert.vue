

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const alertClasses = computed(() => {
  const baseClasses = ['p-4', 'rounded-md']
  
  if (props.variant === 'success') {
    baseClasses.push('bg-green-50')
  } else if (props.variant === 'warning') {
    baseClasses.push('bg-yellow-50')
  } else if (props.variant === 'error') {
    baseClasses.push('bg-red-50')
  } else {
    baseClasses.push('bg-blue-50')
  }
  
  return baseClasses.join(' ')
})

const iconClasses = computed(() => {
  const baseClasses = ['h-5', 'w-5']
  
  if (props.variant === 'success') {
    baseClasses.push('text-green-400')
  } else if (props.variant === 'warning') {
    baseClasses.push('text-yellow-400')
  } else if (props.variant === 'error') {
    baseClasses.push('text-red-400')
  } else {
    baseClasses.push('text-blue-400')
  }
  
  return baseClasses.join(' ')
})

const titleClasses = computed(() => {
  const baseClasses = ['text-sm', 'font-medium']
  
  if (props.variant === 'success') {
    baseClasses.push('text-green-800')
  } else if (props.variant === 'warning') {
    baseClasses.push('text-yellow-800')
  } else if (props.variant === 'error') {
    baseClasses.push('text-red-800')
  } else {
    baseClasses.push('text-blue-800')
  }
  
  return baseClasses.join(' ')
})

const contentClasses = computed(() => {
  const baseClasses = ['text-sm']
  
  if (props.title) {
    baseClasses.push('mt-2')
  }
  
  if (props.variant === 'success') {
    baseClasses.push('text-green-700')
  } else if (props.variant === 'warning') {
    baseClasses.push('text-yellow-700')
  } else if (props.variant === 'error') {
    baseClasses.push('text-red-700')
  } else {
    baseClasses.push('text-blue-700')
  }
  
  return baseClasses.join(' ')
})

const dismissButtonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'rounded-md',
    'p-1.5',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  ]
  
  if (props.variant === 'success') {
    baseClasses.push('bg-green-50', 'text-green-500', 'hover:bg-green-100', 'focus:ring-green-600', 'focus:ring-offset-green-50')
  } else if (props.variant === 'warning') {
    baseClasses.push('bg-yellow-50', 'text-yellow-500', 'hover:bg-yellow-100', 'focus:ring-yellow-600', 'focus:ring-offset-yellow-50')
  } else if (props.variant === 'error') {
    baseClasses.push('bg-red-50', 'text-red-500', 'hover:bg-red-100', 'focus:ring-red-600', 'focus:ring-offset-red-50')
  } else {
    baseClasses.push('bg-blue-50', 'text-blue-500', 'hover:bg-blue-100', 'focus:ring-blue-600', 'focus:ring-offset-blue-50')
  }
  
  return baseClasses.join(' ')
})

const dismissIconClasses = computed(() => {
  return 'h-5 w-5'
})
</script>

<template>
  <div :class="alertClasses">
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Success icon -->
        <svg v-if="variant === 'success'" :class="iconClasses" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <!-- Warning icon -->
        <svg v-else-if="variant === 'warning'" :class="iconClasses" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <!-- Error icon -->
        <svg v-else-if="variant === 'error'" :class="iconClasses" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <!-- Info icon -->
        <svg v-else :class="iconClasses" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 v-if="title" :class="titleClasses">
          {{ title }}
        </h3>
        <div :class="contentClasses">
          <slot>
            <p>{{ message }}</p>
          </slot>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button 
            @click="$emit('dismiss')"
            :class="dismissButtonClasses"
          >
            <svg :class="dismissIconClasses" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques au composant Alert */
</style> 