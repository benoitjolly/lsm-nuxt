import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'

const firebaseConfig = {
  // Remplacez par vos configurations Firebase
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
}

export const useFirebaseAuth = () => {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const googleProvider = new GoogleAuthProvider()

  // Connexion avec Google
  const signInWithGoogle = async () => {
    loading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user
    } catch (e) {
      error.value = e.message
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
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    error,
    loading,
    signInWithGoogle,
    registerWithEmail
  }
} 