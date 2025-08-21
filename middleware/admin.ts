import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Si on est côté serveur en mode SSR, rediriger vers la page d'accueil
  // pour éviter tout risque d'accès non autorisé
  if (process.server) {
    return navigateTo('/')
  }
  
  // Initialiser Firebase et récupérer l'instance auth
  const { auth } = initializeFirebase()
  const { isAdmin, isModerator, isLoggedIn } = useAuth()
  
  // Si on est déjà authentifié côté client et qu'on est admin ou modérateur, laisser passer
  if (isLoggedIn.value && (isAdmin.value || isModerator.value)) {
    return
  }
  
  // Si auth n'est pas disponible ou si l'utilisateur n'est pas admin/modérateur,
  // rediriger vers la page appropriée
  if (!auth || (isLoggedIn.value && !isAdmin.value && !isModerator.value)) {
    console.warn('Accès non autorisé à une route protégée admin/moderator')
    return navigateTo('/')
  }
  
  // Vérifier l'état d'authentification
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
      if (!user) {
        console.warn('Utilisateur non connecté - redirection vers home')
        return resolve(navigateTo('/'))
      }
      
      // Si l'utilisateur est connecté mais n'est pas admin ou modérateur, rediriger vers la page d'accueil
      if (!isAdmin.value && !isModerator.value) {
        console.warn('Utilisateur connecté mais sans droits d\'administrateur ou modérateur')
        return resolve(navigateTo('/'))
      }
      
      // Sinon, laisser passer
      resolve()
    })
  })
}) 