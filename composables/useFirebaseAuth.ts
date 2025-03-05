import type { User } from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { initializeFirebase } from '~/utils/firebase'
import useAuth from './useAuth'

export const useFirebaseAuth = () => {
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  
  // Récupérer les fonctions du composable useAuth
  const { setUser, setAuthenticated } = useAuth()

  // Initialiser Firebase
  const { auth } = initializeFirebase()
  
  // Si auth n'est pas disponible, retourner des fonctions qui ne font rien
  if (!auth) {
    console.error('Firebase auth n\'est pas initialisé correctement')
    return {
      user,
      error: ref('Firebase auth n\'est pas initialisé correctement'),
      loading,
      signInWithGoogle: async () => false,
      signInWithEmail: async () => false,
      registerWithEmail: async () => false
    }
  }
  
  const googleProvider = new GoogleAuthProvider()

  // Connexion avec Google
  const signInWithGoogle = async () => {
    loading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user
      
      // Mettre à jour l'état d'authentification global
      setUser(result.user)
      setAuthenticated(true)
      
      return true
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Connexion avec email/mot de passe
  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
      // Mettre à jour l'état d'authentification global
      setUser(result.user)
      setAuthenticated(true)
      
      return true
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Inscription avec email/mot de passe
  const registerWithEmail = async (email: string, password: string) => {
    loading.value = true
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
      // Mettre à jour l'état d'authentification global
      setUser(result.user)
      setAuthenticated(true)
      
      return true
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    error,
    loading,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail
  }
} 