<template>
  <div class="settings-page">
    <div class="header-section">
      <Heading level="1">Paramètres</Heading>
    </div>

    <div class="tabs-section">
      <Tabs v-model="activeTab" :tabs="settingsTabs">
        <template #default="{ activeTab }">
          
          <!-- Onglet Serrures -->
          <div v-if="activeTab === 'serrures'" class="tab-content">
            <TableauSerrures
              :serrures="serrures"
              :loading="loadingSerrures"
              :can-edit="isModerator"
              :show-add-button="true"
              :show-view-button="false"
              title="Gestion des Serrures"
              description="Configuration et paramètres des serrures"
              @add-serrure="addNewSerrure"
              @edit-serrure="editSerrure"
              @delete-serrure="confirmDeleteSerrure"
            />
          </div>

          <!-- Onglet Types -->
          <div v-if="activeTab === 'types'" class="tab-content">
            <TableauTypes
              :types="types"
              :loading="loadingTypes"
              :can-edit="isModerator"
              :show-add-button="true"
              title="Gestion des Types"
              description="Configuration et paramètres des types de serrures"
              @add-type="addNewType"
              @edit-type="editType"
              @delete-type="confirmDeleteType"
            />
          </div>

        </template>
      </Tabs>
    </div>
    
    <!-- Modal pour les formulaires de serrure -->
    <Modal 
      v-model="showSerrureForm" 
      title="Formulaire de Serrure" 
      size="xl"
      :cancel-text="''"
      :confirm-text="''"
    >
      <EditAuthCheck>
        <SerrureForm 
          :initial-serrure="selectedSerrure" 
          @submit="handleSerrureFormSubmit" 
          @cancel="cancelSerrureForm"
          @unauthorized="handleUnauthorized"
          ref="serrureFormRef"
        />
      </EditAuthCheck>
    </Modal>

    <!-- Modal pour les formulaires de type -->
    <Modal 
      v-model="showTypeForm" 
      title="Formulaire de Type" 
      size="lg"
      :cancel-text="''"
      :confirm-text="''"
    >
      <EditAuthCheck>
        <TypeFormModal 
          :initial-type="selectedType"
          @submit="handleTypeFormSubmit" 
          @cancel="cancelTypeForm"
          @unauthorized="handleUnauthorized"
        />
      </EditAuthCheck>
    </Modal>

    <!-- Modal de confirmation de suppression -->
    <Modal 
      v-model="showDeleteModal" 
      title="Confirmer la suppression" 
      size="md"
      :cancel-text="''"
      :confirm-text="''"
    >
      <p class="text-gray-600 mb-6">
        Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
      </p>
      
      <div class="modal-actions">
        <Button @click="showDeleteModal = false" variant="secondary">
          Annuler
        </Button>
        <Button @click="handleDelete" variant="danger">
          Supprimer
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { 
  Heading, 
  Card, 
  CardContent, 
  Tabs,
  Modal,
  Button
} from '~/design-system/components'
import ComponentSection from '~/components/ComponentSection.vue'
import TableauSerrures from '~/components/TableauSerrures.vue'
import TableauTypes from '~/components/TableauTypes.vue'

import TypeFormModal from '~/components/TypeFormModal.vue'
import SerrureForm from '~/components/SerrureForm.vue'
import EditAuthCheck from '~/components/EditAuthCheck.vue'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'

// Définir le middleware settings pour admin/moderator
definePageMeta({
  middleware: ['settings']
})

// Récupérer les paramètres de route
const route = useRoute()
const router = useRouter()

// Services et composables
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()
const { isModerator } = useAuth()

// Configuration des onglets
const settingsTabs = [
  { id: 'serrures', label: 'Serrures' },
  { id: 'types', label: 'Types' }
]

// État de l'onglet actif - initialiser avec le paramètre de l'URL ou 'serrures' par défaut
const activeTab = ref(route.query.tab as string || 'serrures')

// État pour la gestion des serrures
const serrures = ref<Serrure[]>([])
const loadingSerrures = ref(true)
const showSerrureForm = ref(false)
const selectedSerrure = ref<Partial<Serrure> | undefined>(undefined)
const showDeleteModal = ref(false)
const serrureToDeleteId = ref<string | undefined>(undefined)

const serrureFormRef = ref<InstanceType<typeof SerrureForm> | null>(null)

// État pour la gestion des types
const types = ref<TypeSerrure[]>([])
const loadingTypes = ref(true)
const showTypeForm = ref(false)
const selectedType = ref<Partial<TypeSerrure> | undefined>(undefined)
const typeToDeleteId = ref<string | undefined>(undefined)

// Watcher pour synchroniser l'onglet actif avec l'URL
watch(activeTab, (newTab) => {
  // Mettre à jour l'URL quand l'onglet change
  router.push({
    query: { ...route.query, tab: newTab }
  })
}, { immediate: false })

// Watcher pour synchroniser l'URL avec l'onglet actif
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && settingsTabs.some(tab => tab.id === newTab)) {
    activeTab.value = newTab
  }
}, { immediate: true })

// Charger les données au montage du composant
onMounted(async () => {
  await Promise.all([
    loadSerrures(),
    loadTypes()
  ])
})

// Fonctions pour la gestion des serrures
const loadSerrures = async () => {
  try {
    loadingSerrures.value = true
    serrures.value = await serrureService.getAllSerrures()
  } catch (error) {
    console.error('Erreur lors du chargement des serrures:', error)
  } finally {
    loadingSerrures.value = false
  }
}

const addNewSerrure = () => {
  selectedSerrure.value = undefined
  showSerrureForm.value = true
}

const editSerrure = (serrure: Serrure) => {
  selectedSerrure.value = { ...serrure }
  showSerrureForm.value = true
}

const cancelSerrureForm = () => {
  showSerrureForm.value = false
  selectedSerrure.value = undefined
}

const handleSerrureFormSubmit = async (serrure: Serrure, photoFile?: File, planFile?: File, autreFile?: File) => {
  try {
    loadingSerrures.value = true
    
    if (serrure.id) {
      // Mise à jour
      await serrureService.updateSerrure(serrure.id, serrure, photoFile, planFile, autreFile)
      
      // Mettre à jour la liste locale
      const index = serrures.value.findIndex(s => s.id === serrure.id)
      if (index !== -1) {
        serrures.value[index] = serrure
      }
    } else {
      // Création
      const id = await serrureService.addSerrure(serrure, photoFile, planFile, autreFile)
      serrure.id = id
      serrures.value.push(serrure)
    }
    
    showSerrureForm.value = false
    selectedSerrure.value = undefined
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la serrure:', error)
  } finally {
    loadingSerrures.value = false
  }
}

const confirmDeleteSerrure = (id?: string) => {
  if (id) {
    serrureToDeleteId.value = id
    showDeleteModal.value = true
  }
}

const deleteSerrure = async () => {
  if (!serrureToDeleteId.value) return
  
  try {
    loadingSerrures.value = true
    showDeleteModal.value = false
    
    await serrureService.deleteSerrure(serrureToDeleteId.value)
    
    // Mettre à jour la liste locale
    serrures.value = serrures.value.filter(s => s.id !== serrureToDeleteId.value)
  } catch (error) {
    console.error('Erreur lors de la suppression de la serrure:', error)
  } finally {
    loadingSerrures.value = false
    serrureToDeleteId.value = undefined
  }
}

const handleDelete = async () => {
  if (serrureToDeleteId.value) {
    await deleteSerrure()
  } else if (typeToDeleteId.value) {
    await deleteType()
  }
}

const handleUnauthorized = () => {
  showSerrureForm.value = false
  selectedSerrure.value = undefined
  router.push('/')
}

// Fonctions pour la gestion des types
const loadTypes = async () => {
  try {
    loadingTypes.value = true
    types.value = await typeSerrureService.getAllTypesSerrures()
  } catch (error) {
    console.error('Erreur lors du chargement des types:', error)
  } finally {
    loadingTypes.value = false
  }
}

const addNewType = () => {
  selectedType.value = undefined
  showTypeForm.value = true
}

const editType = (type: TypeSerrure) => {
  selectedType.value = { ...type }
  showTypeForm.value = true
}

const cancelTypeForm = () => {
  showTypeForm.value = false
  selectedType.value = undefined
}

const handleTypeFormSubmit = async (type: TypeSerrure) => {
  try {
    loadingTypes.value = true
    
    if (type.id) {
      // Mise à jour
      await typeSerrureService.updateTypeSerrure(type.id, type)
      
      // Mettre à jour la liste locale
      const index = types.value.findIndex(t => t.id === type.id)
      if (index !== -1) {
        types.value[index] = type
      }
    } else {
      // Création
      const newType = await typeSerrureService.addTypeSerrure(type)
      types.value.push(newType)
    }
    
    showTypeForm.value = false
    selectedType.value = undefined
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du type:', error)
  } finally {
    loadingTypes.value = false
  }
}

const confirmDeleteType = (id?: string) => {
  if (id) {
    typeToDeleteId.value = id
    showDeleteModal.value = true
  }
}

const deleteType = async () => {
  if (!typeToDeleteId.value) return
  
  try {
    loadingTypes.value = true
    showDeleteModal.value = false
    
    await typeSerrureService.deleteTypeSerrure(typeToDeleteId.value)
    
    // Mettre à jour la liste locale
    types.value = types.value.filter(t => t.id !== typeToDeleteId.value)
  } catch (error) {
    console.error('Erreur lors de la suppression du type:', error)
  } finally {
    loadingTypes.value = false
    typeToDeleteId.value = undefined
  }
}
</script>

<style scoped>
.settings-page {
  width: 100%;
  padding: 0.5rem;
  min-height: calc(100vh - 4rem);
  overflow-x: hidden;
}

@media (min-width: 640px) {
  .settings-page {
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  .settings-page {
    padding: 1.5rem;
  }
}

.header-section {
  margin-bottom: 3rem;
}

.tabs-section {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow-x: hidden;
  width: 100%;
}

@media (min-width: 640px) {
  .tabs-section {
    padding: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .tabs-section {
    padding: 1.75rem;
  }
}

.tab-content {
  margin-top: 2rem;
}

.hello-content {
  text-align: center;
  padding: 3rem 2rem;
}

.hello-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.hello-content p {
  color: #6b7280;
  font-size: 1.125rem;
  line-height: 1.6;
}



.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>