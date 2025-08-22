<template>
  <div class="tooltip-container" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <slot />
    <div 
      v-if="showTooltip" 
      class="tooltip"
      :class="position"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const showTooltip = ref(false)
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  z-index: 1000;
  background-color: #1f2937;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease-out;
  width: max-content;
  min-width: fit-content;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip::before {
  content: '';
  position: absolute;
  border: 5px solid transparent;
}

.tooltip.right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip.right::before {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #1f2937;
}

.tooltip.left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip.left::before {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #1f2937;
}

.tooltip.top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip.top::before {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #1f2937;
}

.tooltip.bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip.bottom::before {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #1f2937;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

/* Animation spécifique pour les tooltips en position top/bottom */
.tooltip.top,
.tooltip.bottom {
  animation: tooltipFadeInTopBottom 0.2s ease-out;
}

@keyframes tooltipFadeInTopBottom {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

/* Responsive - masquer les tooltips sur mobile */
@media (max-width: 640px) {
  .tooltip {
    display: none;
  }
}
</style>
