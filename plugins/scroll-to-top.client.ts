export default defineNuxtPlugin(() => {
  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    if (process.client) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Écouter les changements de route avec l'API de navigation de Nuxt
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('page:finish', () => {
    if (process.client) {
      scrollToTop()
    }
  })
})
