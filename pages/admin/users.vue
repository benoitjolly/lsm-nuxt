<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestion des Utilisateurs</h1>
    
    <div v-if="loading" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6 flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <div class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Erreur lors du chargement des utilisateurs</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Liste des utilisateurs
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Gérez les rôles des utilisateurs de l'application
          </p>
        </div>
        
        <div class="relative w-64">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher un utilisateur" 
            class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div v-if="filteredUsers.length === 0" class="p-6 text-center text-gray-500">
        Aucun utilisateur trouvé.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôles
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Dernière connexion
              </th>
              <th scope="col" class="relative px-3 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.uid" class="hover:bg-gray-50">
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="user.photoURL" class="flex-shrink-0 h-10 w-10">
                    <img :src="user.photoURL" alt="" class="h-10 w-10 rounded-full object-cover">
                  </div>
                  <div v-else class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                      <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.displayName || 'Utilisateur sans nom' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="role in user.roles" 
                    :key="role" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ role }}
                  </span>
                  <span 
                    v-if="!user.roles || user.roles.length === 0" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                  >
                    Aucun rôle
                  </span>
                </div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                {{ formatDate(user.lastLoginAt) }}
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="editUserRoles(user)" 
                  class="text-indigo-600 hover:text-indigo-900 p-1"
                >
                  Modifier les rôles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal d'édition des rôles -->
    <div v-if="showRolesModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier les rôles utilisateur
          </h3>
          <button @click="showRolesModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="selectedUser" class="mb-6">
          <div class="flex items-center mb-4">
            <div v-if="selectedUser.photoURL" class="flex-shrink-0 h-12 w-12 mr-3">
              <img :src="selectedUser.photoURL" alt="" class="h-12 w-12 rounded-full object-cover">
            </div>
            <div v-else class="flex-shrink-0 h-12 w-12 mr-3 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-indigo-600">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 class="text-base font-semibold text-gray-900">{{ selectedUser.displayName || 'Utilisateur sans nom' }}</h4>
              <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-3">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="role-admin" 
                v-model="userRoles.admin" 
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label for="role-admin" class="ml-2 block text-sm text-gray-900">
                Administrateur
              </label>
            </div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="role-moderator" 
                v-model="userRoles.moderator" 
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label for="role-moderator" class="ml-2 block text-sm text-gray-900">
                Modérateur
              </label>
            </div>
            <!-- Ajoutez d'autres rôles selon vos besoins -->
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="showRolesModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveUserRoles" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            :disabled="modalLoading"
          >
            <span v-if="modalLoading">Enregistrement...</span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserService, type UserData } from '~/services/userService'
import useAuth from '~/composables/useAuth'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'

// Définir le middleware d'administration
definePageMeta({
  middleware: ['admin']
})

// État local
const users = ref<UserData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showRolesModal = ref(false)
const selectedUser = ref<UserData | null>(null)
const userRoles = ref({
  admin: false,
  moderator: false,
  // Ajoutez d'autres rôles selon vos besoins
})
const modalLoading = ref(false)

const userService = useUserService()
const { isAdmin } = useAuth()

// Utilisateurs filtrés par la recherche
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    (user.displayName?.toLowerCase().includes(query)) || 
    (user.email?.toLowerCase().includes(query))
  )
})

// Charger tous les utilisateurs
const loadUsers = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { db } = initializeFirebase()
    if (!db) {
      throw new Error('Firebase n\'est pas initialisé correctement')
    }
    
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const usersData: UserData[] = []
    
    usersSnapshot.forEach(doc => {
      usersData.push(doc.data() as UserData)
    })
    
    users.value = usersData
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err)
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Ouvrir la modal d'édition des rôles
const editUserRoles = (user: UserData) => {
  selectedUser.value = user
  userRoles.value = {
    admin: user.roles?.includes('admin') || false,
    moderator: user.roles?.includes('moderator') || false,
    // Ajoutez d'autres rôles selon vos besoins
  }
  showRolesModal.value = true
}

// Sauvegarder les rôles d'un utilisateur
const saveUserRoles = async () => {
  if (!selectedUser.value) return
  
  try {
    modalLoading.value = true
    
    // Construire la liste des rôles
    const newRoles: string[] = []
    if (userRoles.value.admin) newRoles.push('admin')
    if (userRoles.value.moderator) newRoles.push('moderator')
    // Ajoutez d'autres rôles selon vos besoins
    
    // Mettre à jour l'utilisateur localement
    if (selectedUser.value) {
      selectedUser.value.roles = newRoles
      
      // Mettre à jour dans Firestore
      const userRef = doc(initializeFirebase().db!, 'users', selectedUser.value.uid)
      await updateDoc(userRef, { roles: newRoles })
      
      // Mettre à jour la liste des utilisateurs
      const index = users.value.findIndex(u => u.uid === selectedUser.value?.uid)
      if (index !== -1) {
        users.value[index].roles = newRoles
      }
    }
    
    showRolesModal.value = false
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des rôles:', err)
    alert('Une erreur est survenue lors de la sauvegarde des rôles')
  } finally {
    modalLoading.value = false
  }
}

// Formater une date
const formatDate = (timestamp: number) => {
  if (!timestamp) return 'Jamais'
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Charger les utilisateurs au chargement de la page
onMounted(async () => {
  await loadUsers()
})
</script> 