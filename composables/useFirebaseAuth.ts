import type { User } from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail as firebaseSendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth'
import { ref, computed } from 'vue'
import { initializeFirebase } from '~/utils/firebase'
import useAuth from './useAuth'

export const useFirebaseAuth = () => {
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(true)
  
  const { setUser, setAuthenticated } = useAuth()

  const { auth } = initializeFirebase()
  
  if (!auth) {
    console.error('Firebase auth n\'est pas initialisé correctement')
    return {
      user,
      error: ref('Firebase auth n\'est pas initialisé correctement'),
      loading,
      signInWithGoogle: async () => false,
      signInWithEmail: async () => false,
      registerWithEmail: async () => false,
      logout: async () => false,
      sendPasswordResetEmail: async () => false,
      isLoggedIn: computed(() => !!user.value),
      isEmailVerified: computed(() => user.value?.emailVerified || false)
    }
  }
  
  const googleProvider = new GoogleAuthProvider()

  const signInWithGoogle = async () => {
    loading.value = true
    try {
      error.value = null
      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user
      
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

  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true
    try {
      error.value = null
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
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

  const registerWithEmail = async (email: string, password: string) => {
    loading.value = true
    try {
      error.value = null
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
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

  const logout = async () => {
    try {
      error.value = null
      await signOut(auth)
      return true
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      }
      return false
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    try {
      error.value = null
      await firebaseSendPasswordResetEmail(auth, email)
      return true
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      }
      return false
    }
  }

  // Observer les changements d'état d'authentification
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser
    loading.value = false
  })

  // Computed properties
  const isLoggedIn = computed(() => !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified || false)

  return {
    user,
    error,
    loading,
    isLoggedIn,
    isEmailVerified,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    logout,
    sendPasswordResetEmail
  }
} 