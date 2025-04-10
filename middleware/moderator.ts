import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Si on est côté serveur en mode SSR, rediriger vers la page de connexion
  // pour éviter tout risque d'accès non autorisé
  if (process.server) {
    return navigateTo('/login')
  }
  
  // Initialiser Firebase et récupérer l'instance auth
  const { auth } = initializeFirebase()
  const { isModerator, isLoggedIn } = useAuth()
  
  // Si on est déjà authentifié côté client et qu'on est modérateur, laisser passer
  if (isLoggedIn.value && isModerator.value) {
    return
  }
  
  // Si auth n'est pas disponible ou si l'utilisateur n'est pas modérateur,
  // rediriger vers la page de connexion
  if (!auth || (isLoggedIn.value && !isModerator.value)) {
    console.warn('Accès non autorisé à une route protégée')
    return navigateTo('/')
  }
  
  // Vérifier l'état d'authentification
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!user) {
        console.warn('Utilisateur non connecté - redirection vers login')
        return resolve(navigateTo('/login'))
      }
      
      // Si l'utilisateur est connecté mais n'est pas modérateur ni admin, rediriger vers la page d'accueil
      if (!isModerator.value) {
        console.warn('Utilisateur connecté mais sans droits de modérateur')
        return resolve(navigateTo('/'))
      }
      
      // Sinon, laisser passer
      resolve()
    })
  })
}) 