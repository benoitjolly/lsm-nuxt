import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { initializeFirebase } from '~/utils/firebase'

// État global pour l'authentification
const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const loading = ref(true)

// Définir le composable avec export default pour une meilleure compatibilité
export default function useAuth() {
  // Définir l'utilisateur actuel
  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  // Définir l'état d'authentification
  const setAuthenticated = (status: boolean) => {
    isAuthenticated.value = status
    loading.value = false
  }

  // Déconnexion
  const logout = async () => {
    try {
      const { auth } = initializeFirebase()
      if (auth) {
        await signOut(auth)
        user.value = null
        isAuthenticated.value = false
        return true
      }
      return false
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return false
    }
  }

  // Vérifier si l'utilisateur est authentifié
  const isLoggedIn = computed(() => isAuthenticated.value)

  // Vérifier si l'utilisateur est admin (à personnaliser selon vos besoins)
  const isAdmin = computed(() => {
    if (!user.value) return false
    // Exemple: vérifier une claim ou un email spécifique
    // return user.value.email === 'admin@example.com'
    return false
  })

  return {
    user,
    isAuthenticated,
    loading,
    setUser,
    setAuthenticated,
    logout,
    isLoggedIn,
    isAdmin
  }
} 