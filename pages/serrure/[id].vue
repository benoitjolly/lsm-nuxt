<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex items-center">
      <NuxtLink 
        to="/serrure" 
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la liste
      </NuxtLink>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Erreur lors du chargement de la serrure</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!serrure" class="bg-yellow-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Serrure introuvable</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>La serrure demandée n'existe pas ou a été supprimée.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Détails de la Serrure: {{ serrure.codeArticle }}
      </h1>
      
      <div v-if="!showForm" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ serrure.designation || 'Sans désignation' }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Type de clé: {{ serrure.typeDeCle }}
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button 
              @click="editSerrure" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button 
              @click="confirmDeleteSerrure" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
        
        <div class="border-t border-gray-200">
          <div v-if="serrure.photoUrl" class="p-4">
            <img 
              :src="serrure.photoUrl" 
              alt="Photo de la serrure" 
              class="h-64 object-cover rounded-md mx-auto"
            />
          </div>
          
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Code Article</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.codeArticle }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Type de Clé</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.typeDeCle }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Longueur du Corps</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.longueurDuCorpsMm }} mm</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Course</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.course }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Sens</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.sens }}</dd>
            </div>
            <div v-if="serrure.sortieDeCle" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Sortie de Clé</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.sortieDeCle }}</dd>
            </div>
            <div v-if="serrure.fixationSerrure" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Fixation Serrure</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.fixationSerrure }}</dd>
            </div>
            <div v-if="serrure.pgPossible" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">PG Possible</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.pgPossible }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Type de Came</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.typeDeCame }}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      <!-- Formulaire d'édition -->
      <div v-if="showForm" class="mt-6">
        <SerrureForm 
          :initial-serrure="serrure" 
          @submit="handleFormSubmit" 
          @cancel="cancelForm"
        />
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSerrureService } from '~/services/serrureService'
import type { Serrure } from '~/types/serrure'

// Définir le middleware d'authentification
definePageMeta({
  middleware: ['auth']
})

// État
const serrure = ref<Serrure | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showForm = ref(false)
const showDeleteModal = ref(false)

// Services et utilitaires
const serrureService = useSerrureService()
const router = useRouter()
const route = useRoute()

// Récupérer l'ID de la serrure depuis l'URL
const serrureId = route.params.id as string

// Charger les détails de la serrure
onMounted(async () => {
  try {
    if (!serrureId) {
      error.value = 'ID de serrure non spécifié'
      return
    }
    console.log('ID de la serrure récupéré:', serrureId)
    
    const result = await serrureService.getSerrureById(serrureId)
    
    if (!result) {
      error.value = 'Serrure introuvable'
      return
    }
    
    serrure.value = result
  } catch (err) {
    console.error('Erreur lors du chargement de la serrure:', err)
    error.value = 'Erreur lors du chargement des données'
  } finally {
    loading.value = false
  }
})

// Modifier la serrure
const editSerrure = () => {
  showForm.value = true
}

// Annuler le formulaire
const cancelForm = () => {
  showForm.value = false
}

// Gérer la soumission du formulaire
const handleFormSubmit = async (updatedSerrure: Serrure, photoFile?: File) => {
  try {
    loading.value = true
    
    if (updatedSerrure.id) {
      await serrureService.updateSerrure(updatedSerrure.id, updatedSerrure, photoFile)
      serrure.value = updatedSerrure
    }
    
    showForm.value = false
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la serrure:', err)
    error.value = 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

// Confirmer la suppression
const confirmDeleteSerrure = () => {
  showDeleteModal.value = true
}

// Supprimer la serrure
const deleteSerrure = async () => {
  if (!serrure.value?.id) return
  
  try {
    loading.value = true
    showDeleteModal.value = false
    
    await serrureService.deleteSerrure(serrure.value.id)
    
    // Rediriger vers la liste des serrures
    router.push('/serrure')
  } catch (err) {
    console.error('Erreur lors de la suppression de la serrure:', err)
    error.value = 'Erreur lors de la suppression'
    loading.value = false
  }
}
</script> 