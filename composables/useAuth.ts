import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { initializeFirebase } from '~/utils/firebase'
import { doc, getDoc } from 'firebase/firestore'

const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const loading = ref(true)
const userRoles = ref<string[]>([])

export default function useAuth() {
  const setUser = async (newUser: User | null) => {
    user.value = newUser
    userRoles.value = []
    
    // Si l'utilisateur est connecté et que nous sommes côté client, récupérer ses rôles
    if (newUser && process.client) {
      try {
        const { db } = initializeFirebase()
        if (db) {
          const userDoc = await getDoc(doc(db, 'users', newUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            userRoles.value = userData.roles || []
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error)
      }
    }
  }

  const setAuthenticated = (status: boolean) => {
    isAuthenticated.value = status
    loading.value = false
  }

  const logout = async () => {
    if (process.server) {
      return false
    }
    
    try {
      const { auth } = initializeFirebase()
      if (auth) {
        await signOut(auth)
        user.value = null
        isAuthenticated.value = false
        userRoles.value = []
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
    return userRoles.value.includes('admin')
  })

  const isModerator = computed(() => {
    return userRoles.value.includes('admin') || userRoles.value.includes('moderator')
  })

  const hasRole = (role: string) => {
    return userRoles.value.includes(role)
  }

  return {
    user,
    isAuthenticated,
    loading,
    userRoles,
    setUser,
    setAuthenticated,
    logout,
    isLoggedIn,
    isAdmin,
    isModerator,
    hasRole
  }
} 