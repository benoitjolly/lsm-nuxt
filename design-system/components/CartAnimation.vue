<template>
  <div 
    v-if="isAnimating"
    ref="animationElement"
    class="cart-animation"
    :style="animationStyle"
  >
    <div class="animation-content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface Props {
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  isAnimating: boolean
}

const props = defineProps<Props>()

const animationElement = ref<HTMLElement>()
const animationStyle = ref({
  position: 'fixed',
  zIndex: '9999',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  left: '0px',
  top: '0px',
  opacity: '0',
  scale: '0'
})

const startAnimation = async () => {
  if (!animationElement.value) return

  // Position initiale
  animationStyle.value = {
    ...animationStyle.value,
    left: `${props.startPosition.x}px`,
    top: `${props.startPosition.y}px`,
    opacity: '1',
    scale: '1'
  }

  // Attendre le prochain tick pour que la position initiale soit appliquée
  await nextTick()

  // Animation vers la position finale
  animationStyle.value = {
    ...animationStyle.value,
    left: `${props.endPosition.x}px`,
    top: `${props.endPosition.y}px`,
    opacity: '0',
    scale: '0.3'
  }
}

onMounted(() => {
  if (props.isAnimating) {
    startAnimation()
  }
})

// Surveiller les changements de isAnimating
watch(() => props.isAnimating, (newValue) => {
  if (newValue) {
    startAnimation()
  }
})
</script>

<style scoped>
.cart-animation {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animation-content {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
}
</style>
