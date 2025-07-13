<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" @click="handleOverlayClick">
      <div 
        :class="modalClasses"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button 
            @click="close" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <slot />
        </div>
        
        <div v-if="hasFooter" class="flex justify-end space-x-3 mt-6">
          <slot name="footer" :close="close">
            <Button variant="secondary" @click="close">
              {{ cancelText }}
            </Button>
            <Button 
              variant="primary" 
              @click="$emit('confirm')"
              :disabled="confirmDisabled"
            >
              {{ confirmText }}
            </Button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const { slots } = getCurrentInstance()

const hasFooter = computed(() => !!slots.footer || props.cancelText || props.confirmText)

const modalClasses = computed(() => {
  const baseClasses = [
    'bg-white',
    'rounded-lg',
    'shadow-xl',
    'p-6',
    'w-full'
  ]
  
  // Tailles
  if (props.size === 'sm') {
    baseClasses.push('max-w-sm')
  } else if (props.size === 'md') {
    baseClasses.push('max-w-md')
  } else if (props.size === 'lg') {
    baseClasses.push('max-w-lg')
  } else if (props.size === 'xl') {
    baseClasses.push('max-w-xl')
  }
  
  return baseClasses.join(' ')
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}
</script>

<style scoped>
.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}
</style> 