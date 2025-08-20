<template>
  <div>
    <Heading level="1" class="mb-6">Gestion des Utilisateurs</Heading>
    
    <Card v-if="loading" class="mb-6">
      <div class="p-6 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Card>
    
    <Card v-else-if="error" class="mb-6">
      <Alert 
        variant="error" 
        title="Erreur lors du chargement des utilisateurs"
        :message="error"
      />
    </Card>
    
    <Card v-else class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <Heading level="3">
              Liste des utilisateurs
            </Heading>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Gérez les rôles des utilisateurs de l'application
            </p>
          </div>
          
          <SearchInput 
            v-model="searchQuery"
            placeholder="Rechercher un utilisateur"
            width="w-64"
          />
        </div>
      </template>
      
      <Table
        :columns="tableColumns"
        :data="filteredUsers"
        :loading="false"
        empty-message="Aucun utilisateur trouvé."
        row-key="uid"
      >
        <template #cell-user="{ item }">
          <div class="flex items-center">
            <Avatar 
              :src="(item as any)?.photoURL || ''" 
              :alt="(item as any)?.displayName || 'Utilisateur'"
              size="base"
              class="mr-4"
            />
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ (item as any)?.displayName || 'Utilisateur sans nom' }}
              </div>
            </div>
          </div>
        </template>
        
        <template #cell-email="{ value }">
          <div class="text-sm text-gray-500">{{ value }}</div>
        </template>
        
        <template #cell-roles="{ item }">
          <div class="flex flex-wrap gap-2">
            <Badge 
              v-for="role in (item as any)?.roles || []" 
              :key="role"
              variant="primary"
            >
              {{ role }}
            </Badge>
            <Badge 
              v-if="!(item as any)?.roles || (item as any)?.roles?.length === 0"
              variant="secondary"
            >
              Aucun rôle
            </Badge>
          </div>
        </template>
        

        
        <template #actions="{ item }">
          <button 
            @click="editUserRoles(item as UserData)" 
            class="text-indigo-600 hover:text-indigo-900 p-1"
          >
            Modifier les rôles
          </button>
        </template>
      </Table>
    </Card>
    
    <!-- Modal d'édition des rôles -->
    <Modal
      v-model="showRolesModal"
      :title="'Modifier les rôles utilisateur'"
      size="md"
      :confirm-disabled="modalLoading"
      @confirm="saveUserRoles"
    >
      <div v-if="selectedUser" class="mb-6">
        <div class="flex items-center mb-4">
          <Avatar 
            :src="selectedUser.photoURL" 
            :alt="selectedUser.displayName || 'Utilisateur'"
            size="lg"
            class="mr-3"
          />
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
      
      <template #footer="{ close }">
        <Button variant="secondary" @click="close">
          Annuler
        </Button>
        <Button 
          variant="primary" 
          @click="saveUserRoles"
          :disabled="modalLoading"
        >
          {{ modalLoading ? 'Enregistrement...' : 'Enregistrer' }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserService, type UserData } from '~/services/userService'
import useAuth from '~/composables/useAuth'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'
import { 
  Heading, 
  Card, 
  Alert, 
  SearchInput, 
  Table, 
  Avatar, 
  Badge, 
  Modal, 
  Button 
} from '~/design-system/components'

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

// Configuration des colonnes du tableau
const tableColumns = [
  {
    key: 'user',
    label: 'Utilisateur'
  },
  {
    key: 'email',
    label: 'Email',
    hidden: 'hidden md:table-cell'
  },
  {
    key: 'roles',
    label: 'Rôles'
  },
  {
    key: 'lastLoginAt',
    label: 'Dernière connexion',
    type: 'datetime',
    dateFormat: 'short',
    emptyText: 'Jamais',
    hidden: 'hidden md:table-cell'
  }
]

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



// Charger les utilisateurs au chargement de la page
onMounted(async () => {
  await loadUsers()
})
</script> 