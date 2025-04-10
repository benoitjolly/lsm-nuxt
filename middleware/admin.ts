import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Initialiser Firebase et récupérer l'instance auth
  const { auth } = initializeFirebase()
  const { isAdmin } = useAuth()
  
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
      
      // Si l'utilisateur est connecté mais n'est pas admin, rediriger vers la page d'accueil
      if (!isAdmin.value) {
        return resolve(navigateTo('/'))
      }
      
      // Sinon, laisser passer
      resolve()
    })
  })
}) 