import { initializeFirebase } from '~/utils/firebase'

export default defineNuxtPlugin(() => {
  // Initialiser Firebase au démarrage de l'application
  initializeFirebase()
}) 