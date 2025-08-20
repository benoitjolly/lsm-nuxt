<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8" @click="handleOverlayClick">
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
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
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
    'p-4',
    'sm:p-6',
    'w-full'
  ]
  
  // Tailles
  if (props.size === 'sm') {
    baseClasses.push('modal-sm')
  } else if (props.size === 'md') {
    baseClasses.push('modal-md')
  } else if (props.size === 'lg') {
    baseClasses.push('modal-lg')
  } else if (props.size === 'xl') {
    baseClasses.push('modal-xl')
  } else if (props.size === '2xl') {
    baseClasses.push('modal-2xl')
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

/* Tailles des modals avec marges horizontales */
.modal-sm {
  max-width: 384px; /* 24rem */
  margin: 0 1rem;
}

.modal-md {
  max-width: 448px; /* 28rem */
  margin: 0 1.5rem;
}

.modal-lg {
  max-width: 512px; /* 32rem */
  margin: 0 2rem;
}

.modal-xl {
  max-width: 576px; /* 36rem */
  margin: 0 2.5rem;
}

.modal-2xl {
  max-width: 672px; /* 42rem */
  margin: 0 3rem;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .modal-lg {
    margin: 0 3rem;
  }
  
  .modal-xl {
    margin: 0 3.5rem;
  }
  
  .modal-2xl {
    margin: 0 4rem;
  }
}

@media (min-width: 1024px) {
  .modal-lg {
    margin: 0 4rem;
  }
  
  .modal-xl {
    margin: 0 5rem;
  }
  
  .modal-2xl {
    margin: 0 6rem;
  }
}
</style> 