import { ref } from 'vue'

export const useCartAnimation = () => {
  const isAnimating = ref(false)

  const triggerAnimation = () => {
    isAnimating.value = true

    // Arrêter l'animation après 600ms
    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }

  return {
    isAnimating,
    triggerAnimation
  }
}
