import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Si on est côté serveur en mode SSR, laisser passer
  // Le client gèrera l'authentification
  if (process.server) {
    return
  }
  
  // Ne pas exécuter ce middleware pour les routes d'authentification
  const publicRoutes = ['/login', '/register', '/reset-password']
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Initialiser Firebase et récupérer l'instance auth
  const { auth } = initializeFirebase()
  const { isLoggedIn } = useAuth()
  
  // Si on est déjà authentifié côté client, laisser passer
  if (isLoggedIn.value) {
    return
  }
  
  // Si auth n'est pas disponible, rediriger vers la page de connexion
  if (!auth) {
    return navigateTo('/login')
  }
  
  // Vérifier l'état d'authentification
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!user) {
        return resolve(navigateTo('/login'))
      }
      
      // Sinon, laisser passer
      resolve()
    })
  })
}) 