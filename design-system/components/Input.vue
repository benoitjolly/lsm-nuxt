<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-label-base text-primary mb-2">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div v-if="icon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-tertiary" />
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-caption text-error">
      {{ error }}
    </p>
    
    <p v-if="hint && !error" class="mt-1 text-caption text-secondary">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'rounded-top', 'rounded-bottom', 'no-rounded'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'px-3',
    'py-2',
    'text-body-base',
    'text-primary',
    'bg-surface-primary',
    'border',
    'placeholder:text-tertiary',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent',
    'focus:border-accent'
  ]

  // Border radius based on variant
  if (props.variant === 'rounded-top') {
    baseClasses.push('input-rounded-top')
  } else if (props.variant === 'rounded-bottom') {
    baseClasses.push('input-rounded-bottom')
  } else if (props.variant === 'no-rounded') {
    baseClasses.push('input-no-rounded')
  } else {
    baseClasses.push('rounded-md')
  }

  // Border color based on state
  if (props.error) {
    baseClasses.push('border-error')
  } else {
    baseClasses.push('border-secondary')
  }

  // Disabled state
  if (props.disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  return baseClasses.join(' ')
})
</script>

<style scoped>
.input-rounded-top {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.input-rounded-bottom {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.input-no-rounded {
  border-radius: 0;
}
</style> 