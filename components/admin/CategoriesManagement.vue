<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <Heading level="3">Gestion des Catégories</Heading>
        <p class="mt-1 text-sm text-gray-500">
          Gérez les catégories de serrures disponibles
        </p>
      </div>
      <Button variant="primary" @click="showCreateModal = true">
        Ajouter une catégorie
      </Button>
    </div>

    <div class="mb-4">
      <SearchInput 
        v-model="searchQuery"
        placeholder="Rechercher par nom ou description"
        width="w-96"
      />
    </div>

    <Card v-if="loading" class="mb-6">
      <div class="p-6 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Card>

    <Card v-else-if="error" class="mb-6">
      <Alert 
        variant="error" 
        title="Erreur lors du chargement des catégories"
        :message="error"
      />
    </Card>

    <Card v-else>
      <Table
        :columns="tableColumns"
        :data="filteredCategories"
        :loading="false"
        empty-message="Aucune catégorie trouvée."
        row-key="id"
      >
        <template #cell-serruresCount="{ item }">
          <Badge variant="secondary">
            {{ getSerruresCount((item as any).id) }} serrure{{ getSerruresCount((item as any).id) > 1 ? 's' : '' }}
          </Badge>
        </template>

        <template #actions="{ item }">
          <div class="flex space-x-2">
            <button 
              @click="editCategory(item as any)" 
              class="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              Modifier
            </button>
            <button 
              @click="deleteCategory(item as any)" 
              class="text-red-600 hover:text-red-900 text-sm"
              :disabled="getSerruresCount((item as any).id) > 0"
              :class="{ 'opacity-50 cursor-not-allowed': getSerruresCount((item as any).id) > 0 }"
            >
              Supprimer
            </button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Modal de création/modification -->
    <Modal
      v-model="showCreateModal"
      :title="editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'"
      size="md"
      @confirm="saveCategory"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nom de la catégorie *
          </label>
          <Input v-model="formData.nom" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            v-model="formData.description"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Description optionnelle de la catégorie"
          ></textarea>
        </div>
      </div>

      <template #footer="{ close }">
        <Button variant="secondary" @click="close">
          Annuler
        </Button>
        <Button 
          variant="primary" 
          @click="saveCategory"
          :disabled="modalLoading || !formData.nom.trim()"
        >
          {{ modalLoading ? 'Enregistrement...' : 'Enregistrer' }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  Heading, 
  Card, 
  Alert, 
  SearchInput, 
  Table, 
  Badge, 
  Modal, 
  Button,
  Input
} from '~/design-system/components'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import { useSerrureService } from '~/services/serrureService'
import type { TypeSerrure } from '~/types/typeSerrure'
import type { Serrure } from '~/types/serrure'

// État local
const categories = ref<TypeSerrure[]>([])
const serrures = ref<Serrure[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showCreateModal = ref(false)
const modalLoading = ref(false)
const editingCategory = ref<TypeSerrure | null>(null)

// Données du formulaire
const formData = ref({
  nom: '',
  description: ''
})

// Services
const typeSerrureService = useTypeSerrureService()
const serrureService = useSerrureService()

// Configuration des colonnes du tableau
const tableColumns = [
  {
    key: 'nom',
    label: 'Nom de la catégorie'
  },
  {
    key: 'serruresCount',
    label: 'Nombre de serrures'
  }
]

// Catégories filtrées par la recherche
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => 
    category.nom?.toLowerCase().includes(query) ||
    category.description?.toLowerCase().includes(query)
  )
})

// Compter les serrures par catégorie
const getSerruresCount = (categoryId: string): number => {
  return serrures.value.filter(serrure => serrure.typeSerrureId === categoryId).length
}

// Charger les catégories
const loadCategories = async () => {
  try {
    loading.value = true
    error.value = null
    
    const [categoriesData, serruresData] = await Promise.all([
      typeSerrureService.getAllTypesSerrures(),
      serrureService.getAllSerrures()
    ])
    
    categories.value = categoriesData
    serrures.value = serruresData
    
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    nom: '',
    description: ''
  }
  editingCategory.value = null
}

// Modifier une catégorie
const editCategory = (category: TypeSerrure) => {
  editingCategory.value = category
  formData.value = {
    nom: category.nom || '',
    description: category.description || ''
  }
  showCreateModal.value = true
}

// Sauvegarder une catégorie
const saveCategory = async () => {
  if (!formData.value.nom.trim()) return
  
  try {
    modalLoading.value = true
    
    const categoryData: TypeSerrure = {
      nom: formData.value.nom.trim(),
      description: formData.value.description.trim()
    }
    
    if (editingCategory.value) {
      await typeSerrureService.updateTypeSerrure(editingCategory.value.id!, categoryData)
    } else {
      await typeSerrureService.addTypeSerrure(categoryData)
    }
    
    showCreateModal.value = false
    resetForm()
    await loadCategories()
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    alert('Une erreur est survenue lors de la sauvegarde')
  } finally {
    modalLoading.value = false
  }
}

// Supprimer une catégorie
const deleteCategory = async (category: TypeSerrure) => {
  const serruresCount = getSerruresCount(category.id!)
  
  if (serruresCount > 0) {
    alert(`Impossible de supprimer cette catégorie car elle contient ${serruresCount} serrure${serruresCount > 1 ? 's' : ''}.`)
    return
  }
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return
  
  try {
    await typeSerrureService.deleteTypeSerrure(category.id!)
    await loadCategories()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    alert('Une erreur est survenue lors de la suppression')
  }
}

// Charger les données au montage
onMounted(async () => {
  await loadCategories()
})
</script> 