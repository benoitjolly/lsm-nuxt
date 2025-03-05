import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Liste des routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/register']
  
  // Si la route est publique, on laisse passer
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Initialiser Firebase et récupérer l'instance auth
  const { auth } = initializeFirebase()
  
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