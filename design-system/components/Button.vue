<template>
  <button 
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'login', 'google'].includes(value)
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['sm', 'base', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-accent'
  ]

  // Variant classes
  if (props.variant === 'primary') {
    baseClasses.push('button-primary')
  } else if (props.variant === 'secondary') {
    baseClasses.push('button-secondary')
  } else if (props.variant === 'outline') {
    baseClasses.push(
      'bg-surface-primary',
      'text-primary',
      'border',
      'border-primary',
      'hover:bg-surface-secondary'
    )
  } else if (props.variant === 'login') {
    baseClasses.push(
      'group',
      'relative',
      'border',
      'border-transparent',
      'text-white',
      'bg-indigo-600',
      'hover:bg-indigo-700',
      'focus:ring-indigo-500'
    )
  } else if (props.variant === 'google') {
    baseClasses.push(
      'border',
      'border-gray-300',
      'shadow-sm',
      'text-gray-700',
      'bg-white',
      'hover:bg-gray-50',
      'focus:ring-indigo-500'
    )
  }

  // Size classes
  if (props.size === 'sm') {
    baseClasses.push('px-3', 'py-1.5', 'text-label-sm', 'rounded')
  } else if (props.size === 'base') {
    baseClasses.push('px-4', 'py-2', 'text-label-base', 'rounded-md')
  } else if (props.size === 'lg') {
    baseClasses.push('px-6', 'py-3', 'text-label-lg', 'rounded-lg')
  }

  // Full width
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }

  // Disabled state
  if (props.disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  return baseClasses.join(' ')
})
</script> 