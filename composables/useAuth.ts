import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { initializeFirebase } from '~/utils/firebase'

const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const loading = ref(true)

export default function useAuth() {
  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const setAuthenticated = (status: boolean) => {
    isAuthenticated.value = status
    loading.value = false
  }

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

  const isLoggedIn = computed(() => isAuthenticated.value)

  const isAdmin = computed(() => {
    if (!user.value) return false
    
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