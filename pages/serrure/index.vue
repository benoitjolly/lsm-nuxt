<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestion des Serrures</h1>
    
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else>
      <!-- Formulaire d'ajout/modification -->
      <div v-if="showForm">
        <SerrureForm 
          :initial-serrure="selectedSerrure" 
          @submit="handleFormSubmit" 
          @cancel="cancelForm"
        />
      </div>
      
      <!-- Liste des serrures -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Vos serrures connectées
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Gérez vos serrures intelligentes
            </p>
          </div>
          
          <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <!-- Recherche -->
            <div class="relative w-full sm:w-auto">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Rechercher par code article" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <!-- Bouton d'ajout -->
            <button 
              @click="addNewSerrure" 
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter une nouvelle serrure
            </button>
          </div>
        </div>
        
        <div class="border-t border-gray-200">
          <div v-if="filteredSerrures.length === 0" class="p-6 text-center text-gray-500">
            Aucune serrure trouvée. Ajoutez-en une nouvelle !
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code Article
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Désignation
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Type de Clé
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Longueur
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Course
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Sens
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Type de Came
                  </th>
                  <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="serrure in filteredSerrures" :key="serrure.id" class="hover:bg-gray-50">
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div v-if="serrure.photoUrl" class="h-10 w-10">
                      <img 
                        :src="serrure.photoUrl" 
                        alt="Photo de la serrure" 
                        class="h-10 w-10 object-cover rounded-md"
                      />
                    </div>
                    <div v-else class="p-2 bg-indigo-100 rounded-md h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ serrure.codeArticle }}</div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                    <div class="text-sm text-gray-500">{{ serrure.designation || 'Sans désignation' }}</div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {{ serrure.typeDeCle }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {{ serrure.longueurDuCorpsMm }} mm
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {{ serrure.course }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {{ serrure.sens }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {{ serrure.typeDeCame }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <NuxtLink 
                        :to="`/serrure/${serrure.id}`" 
                        class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        title="Détails"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span class="hidden sm:inline ml-1">Détails</span>
                      </NuxtLink>
                      
                      <button 
                        @click="editSerrure(serrure)" 
                        class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        title="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span class="hidden sm:inline ml-1">Modifier</span>
                      </button>
                      <button 
                        @click="confirmDeleteSerrure(serrure.id)" 
                        class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span class="hidden sm:inline ml-1">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Modal de confirmation de suppression -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
          <p class="text-sm text-gray-500 mb-6">
            Êtes-vous sûr de vouloir supprimer cette serrure ? Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              @click="deleteSerrure" 
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSerrureService } from '~/services/serrureService'
import type { Serrure } from '~/types/serrure'

// Définir le middleware d'authentification
definePageMeta({
  middleware: ['auth']
})

// État
const serrures = ref<Serrure[]>([])
const loading = ref(true)
const showForm = ref(false)
const selectedSerrure = ref<Partial<Serrure> | undefined>(undefined)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const serrureToDeleteId = ref<string | undefined>(undefined)

// Services
const serrureService = useSerrureService()

// Serrures filtrées par la recherche
const filteredSerrures = computed(() => {
  if (!searchQuery.value) return serrures.value
  
  const query = searchQuery.value.toLowerCase()
  return serrures.value.filter(serrure => 
    serrure.codeArticle.toLowerCase().includes(query) ||
    (serrure.designation && serrure.designation.toLowerCase().includes(query))
  )
})

// Charger les serrures au montage du composant
onMounted(async () => {
  try {
    serrures.value = await serrureService.getAllSerrures()
  } catch (error) {
    console.error('Erreur lors du chargement des serrures:', error)
    // Gérer l'erreur (afficher un message, etc.)
  } finally {
    loading.value = false
  }
})

// Ajouter une nouvelle serrure
const addNewSerrure = () => {
  selectedSerrure.value = undefined
  showForm.value = true
}

// Modifier une serrure existante
const editSerrure = (serrure: Serrure) => {
  selectedSerrure.value = { ...serrure }
  showForm.value = true
}

// Annuler le formulaire
const cancelForm = () => {
  showForm.value = false
  selectedSerrure.value = undefined
}

// Gérer la soumission du formulaire
const handleFormSubmit = async (serrure: Serrure, photoFile?: File) => {
  try {
    loading.value = true
    
    if (serrure.id) {
      // Mise à jour
      await serrureService.updateSerrure(serrure.id, serrure, photoFile)
      
      // Mettre à jour la liste locale
      const index = serrures.value.findIndex(s => s.id === serrure.id)
      if (index !== -1) {
        serrures.value[index] = serrure
      }
    } else {
      // Ajout
      const id = await serrureService.addSerrure(serrure, photoFile)
      
      // Ajouter à la liste locale
      serrures.value.push({ ...serrure, id })
    }
    
    // Fermer le formulaire
    showForm.value = false
    selectedSerrure.value = undefined
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la serrure:', error)
    // Gérer l'erreur (afficher un message, etc.)
  } finally {
    loading.value = false
  }
}

// Confirmer la suppression d'une serrure
const confirmDeleteSerrure = (id?: string) => {
  if (id) {
    serrureToDeleteId.value = id
    showDeleteModal.value = true
  }
}

// Supprimer une serrure
const deleteSerrure = async () => {
  if (!serrureToDeleteId.value) return
  
  try {
    loading.value = true
    showDeleteModal.value = false
    
    await serrureService.deleteSerrure(serrureToDeleteId.value)
    
    // Mettre à jour la liste locale
    serrures.value = serrures.value.filter(s => s.id !== serrureToDeleteId.value)
  } catch (error) {
    console.error('Erreur lors de la suppression de la serrure:', error)
    // Gérer l'erreur (afficher un message, etc.)
  } finally {
    loading.value = false
    serrureToDeleteId.value = undefined
  }
}
</script> 