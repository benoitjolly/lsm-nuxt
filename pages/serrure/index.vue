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
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Vos serrures connectées
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Gérez vos serrures intelligentes
            </p>
          </div>
          
          <div class="flex space-x-4">
            <!-- Recherche -->
            <div class="relative">
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
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <SerrureCard 
              v-for="serrure in filteredSerrures" 
              :key="serrure.id" 
              :serrure="serrure"
              @edit="editSerrure"
              @delete="confirmDeleteSerrure"
            />
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