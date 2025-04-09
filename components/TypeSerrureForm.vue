<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      Gestion des types de serrures
    </h2>
    
    <!-- Formulaire d'ajout -->
    <form @submit.prevent="addType" class="mb-6 border-b border-gray-200 pb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="col-span-2">
          <label for="typeName" class="block text-sm font-medium text-gray-700">Nom du type</label>
          <input 
            type="text" 
            id="typeName" 
            v-model="newType.nom" 
            required
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
            placeholder="Entrez le nom du type"
          />
        </div>
        
        <div class="flex items-end">
          <button 
            type="submit" 
            class="inline-flex justify-center py-3 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            :disabled="loading"
          >
            <span v-if="loading">Ajout en cours...</span>
            <span v-else>Ajouter</span>
          </button>
        </div>
      </div>
    </form>
    
    <!-- Liste des types existants -->
    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else>
      <h3 class="text-lg font-medium text-gray-900 mb-3">Types de serrures existants</h3>
      
      <div v-if="typesList.length === 0" class="text-gray-500 text-sm">
        Aucun type de serrure défini. Ajoutez-en un nouveau ci-dessus.
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="type in typesList" :key="type.id" class="py-3 flex justify-between items-center">
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-900">{{ type.nom }}</span>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button 
              @click="deleteType(type.id)" 
              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Supprimer
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import type { TypeSerrure } from '~/types/typeSerrure'

const emit = defineEmits<{
  (e: 'types-updated', types: TypeSerrure[]): void
}>()

const typeSerrureService = useTypeSerrureService()
const typesList = ref<TypeSerrure[]>([])
const newType = ref<TypeSerrure>({ nom: '' })
const loading = ref(false)
const error = ref<string | null>(null)

// Charger les types de serrures au chargement du composant
onMounted(async () => {
  await loadTypes()
})

// Charger les types de serrures
const loadTypes = async () => {
  loading.value = true
  try {
    typesList.value = await typeSerrureService.getAllTypesSerrures()
    emit('types-updated', typesList.value)
  } catch (err) {
    console.error('Erreur lors du chargement des types de serrures:', err)
    error.value = 'Erreur lors du chargement des types de serrures'
  } finally {
    loading.value = false
  }
}

// Ajouter un nouveau type
const addType = async () => {
  if (!newType.value.nom.trim()) {
    error.value = 'Le nom du type ne peut pas être vide'
    return
  }
  
  loading.value = true
  try {
    await typeSerrureService.addTypeSerrure(newType.value)
    newType.value = { nom: '' }
    await loadTypes()
  } catch (err) {
    console.error('Erreur lors de l\'ajout du type de serrure:', err)
    error.value = 'Erreur lors de l\'ajout du type de serrure'
  } finally {
    loading.value = false
  }
}

// Supprimer un type
const deleteType = async (id?: string) => {
  if (!id) return
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de serrure ?')) {
    return
  }
  
  loading.value = true
  try {
    await typeSerrureService.deleteTypeSerrure(id)
    await loadTypes()
  } catch (err) {
    console.error('Erreur lors de la suppression du type de serrure:', err)
    error.value = 'Erreur lors de la suppression du type de serrure'
  } finally {
    loading.value = false
  }
}

defineExpose({
  typesList,
  loadTypes
})
</script> 