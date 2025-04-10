import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Ce plugin ne s'exécute que côté client
  const { auth } = initializeFirebase()
  
  if (auth) {
    const { setUser, setAuthenticated } = useAuth()
    // Attendre que l'état de l'authentification soit récupéré
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        await setUser(user)
        setAuthenticated(!!user)
        unsubscribe()
        resolve()
      })
    })
  }
}) 