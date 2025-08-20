<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <Heading level="3">Gestion des Serrures</Heading>
        <p class="mt-1 text-sm text-gray-500">
          Gérez l'inventaire des serrures disponibles
        </p>
      </div>
      <Button variant="primary" @click="showCreateModal = true">
        Ajouter une serrure
      </Button>
    </div>

    <div class="mb-4">
      <SearchInput 
        v-model="searchQuery"
        placeholder="Rechercher par code article ou désignation"
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
        title="Erreur lors du chargement des serrures"
        :message="error"
      />
    </Card>

    <Card v-else>
      <Table
        :columns="tableColumns"
        :data="filteredSerrures"
        :loading="false"
        empty-message="Aucune serrure trouvée."
        row-key="id"
      >
        <template #cell-photo="{ item }">
          <img 
            v-if="(item as any).photoUrl" 
            :src="(item as any).photoUrl" 
            :alt="(item as any).designation"
            class="w-12 h-12 object-cover rounded"
          />
          <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <span class="text-gray-400 text-xs">Pas d'image</span>
          </div>
        </template>

        <template #cell-type="{ item }">
          <Badge 
            :variant="(item as any).typeSerrureNom ? 'primary' : 'secondary'"
          >
            {{ (item as any).typeSerrureNom || 'Non catégorisé' }}
          </Badge>
        </template>

        <template #actions="{ item }">
          <div class="flex space-x-2">
            <button 
              @click="editSerrure(item as any)" 
              class="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              Modifier
            </button>
            <button 
              @click="deleteSerrure(item as any)" 
              class="text-red-600 hover:text-red-900 text-sm"
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
      :title="editingSerrure ? 'Modifier la serrure' : 'Ajouter une serrure'"
      size="lg"
      @confirm="saveSerrure"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Code Article *
            </label>
            <textarea
              v-model="formData.codeArticle"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-vertical"
              placeholder="Entrez le code article (les sauts de ligne sont pris en compte)"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select 
              v-model="formData.typeSerrureId"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option v-for="type in typesSerrures" :key="type.id" :value="type.id">
                {{ type.nom }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Désignation
          </label>
          <Input v-model="formData.designation" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Longueur du corps (mm) *
            </label>
            <input
              v-model="formData.longueurDuCorpsMm"
              type="number"
              step="0.1"
              placeholder="Ex: 50.5"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type de clé
            </label>
            <Input v-model="formData.typeDeCle" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <Input v-model="formData.course" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sens
            </label>
            <Input v-model="formData.sens" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Type de came *
          </label>
          <Input v-model="formData.typeDeCame" />
        </div>
      </div>

      <template #footer="{ close }">
        <Button variant="secondary" @click="close">
          Annuler
        </Button>
        <Button 
          variant="primary" 
          @click="saveSerrure"
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
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'

// État local
const serrures = ref<Serrure[]>([])
const typesSerrures = ref<TypeSerrure[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showCreateModal = ref(false)
const modalLoading = ref(false)
const editingSerrure = ref<Serrure | null>(null)

// Données du formulaire
const formData = ref({
  codeArticle: '',
  typeSerrureId: '',
  designation: '',
  longueurDuCorpsMm: 0,
  typeDeCle: '',
  course: '',
  sens: '',
  typeDeCame: ''
})

// Services
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()

// Configuration des colonnes du tableau
const tableColumns = [
  {
    key: 'photo',
    label: 'Photo'
  },
  {
    key: 'codeArticle',
    label: 'Code Article'
  },
  {
    key: 'designation',
    label: 'Désignation',
    hidden: 'hidden md:table-cell'
  },
  {
    key: 'type',
    label: 'Catégorie'
  },
  {
    key: 'longueurDuCorpsMm',
    label: 'Longueur (mm)',
    type: 'number',
    hidden: 'hidden lg:table-cell'
  }
]

// Serrures filtrées par la recherche
const filteredSerrures = computed(() => {
  if (!searchQuery.value) return serrures.value
  
  const query = searchQuery.value.toLowerCase()
  return serrures.value.filter(serrure => 
    serrure.codeArticle?.toLowerCase().includes(query) ||
    serrure.designation?.toLowerCase().includes(query)
  )
})

// Charger les serrures
const loadSerrures = async () => {
  try {
    loading.value = true
    error.value = null
    
    const [serruresData, typesData] = await Promise.all([
      serrureService.getAllSerrures(),
      typeSerrureService.getAllTypesSerrures()
    ])
    
    serrures.value = serruresData
    typesSerrures.value = typesData
    
    // Enrichir les serrures avec le nom du type
    serrures.value = serruresData.map(serrure => ({
      ...serrure,
      typeSerrureNom: typesData.find(type => type.id === serrure.typeSerrureId)?.nom
    }))
    
  } catch (err) {
    console.error('Erreur lors du chargement des serrures:', err)
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    codeArticle: '',
    typeSerrureId: '',
    designation: '',
    longueurDuCorpsMm: 0,
    typeDeCle: '',
    course: '',
    sens: '',
    typeDeCame: ''
  }
  editingSerrure.value = null
}

// Modifier une serrure
const editSerrure = (serrure: Serrure) => {
  editingSerrure.value = serrure
  formData.value = {
    codeArticle: serrure.codeArticle || '',
    typeSerrureId: serrure.typeSerrureId || '',
    designation: serrure.designation || '',
    longueurDuCorpsMm: serrure.longueurDuCorpsMm || 0,
    typeDeCle: serrure.typeDeCle || '',
    course: serrure.course || '',
    sens: serrure.sens || '',
    typeDeCame: serrure.typeDeCame || ''
  }
  showCreateModal.value = true
}

// Sauvegarder une serrure
const saveSerrure = async () => {
  try {
    modalLoading.value = true
    
    const serrureData: Partial<Serrure> = {
      ...formData.value,
      typeSerrureNom: typesSerrures.value.find(t => t.id === formData.value.typeSerrureId)?.nom
    }
    
    if (editingSerrure.value) {
      await serrureService.updateSerrure(editingSerrure.value.id!, serrureData)
    } else {
      await serrureService.addSerrure(serrureData as Serrure)
    }
    
    showCreateModal.value = false
    resetForm()
    await loadSerrures()
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    alert('Une erreur est survenue lors de la sauvegarde')
  } finally {
    modalLoading.value = false
  }
}

// Supprimer une serrure
const deleteSerrure = async (serrure: Serrure) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette serrure ?')) return
  
  try {
    await serrureService.deleteSerrure(serrure.id!)
    await loadSerrures()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    alert('Une erreur est survenue lors de la suppression')
  }
}

// Charger les données au montage
onMounted(async () => {
  await loadSerrures()
})
</script> 