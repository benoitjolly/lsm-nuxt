<template>
  <div>
    <Heading level="1" class="mb-6">Paramètres</Heading>
    <p class="text-sm text-gray-500 max-w-3xl mb-8">
      Configuration et gestion des paramètres du système
    </p>

    <Card class="mb-6">
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

          <!-- Onglet Commandes -->
          <div v-if="activeTab === 'commandes'" class="tab-content">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Gestion des Commandes</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Consultation et gestion des commandes effectuées
                </p>
              </div>

              <!-- Filtre par statut -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex flex-wrap items-center gap-4">
                  <label class="text-sm font-medium text-gray-700">Filtrer par statut :</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      @click="selectedStatusFilter = null"
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150',
                        selectedStatusFilter === null
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      ]"
                    >
                      Tous
                    </button>
                    <button
                      v-for="status in availableStatuses"
                      :key="status.value"
                      @click="selectedStatusFilter = status.value"
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150',
                        selectedStatusFilter === status.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      ]"
                    >
                      {{ status.label }}
                    </button>
                  </div>
                  <div class="ml-auto text-sm text-gray-500">
                    {{ filteredOrders.length }} commande{{ filteredOrders.length > 1 ? 's' : '' }}
                  </div>
                </div>
              </div>

              <!-- Loading state -->
              <div v-if="loadingOrders" class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500">Chargement des commandes...</p>
              </div>

              <!-- Empty state -->
              <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  {{ selectedStatusFilter ? `Aucune commande ${getStatusLabel(selectedStatusFilter).toLowerCase()}` : 'Aucune commande' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ selectedStatusFilter ? `Aucune commande avec le statut "${getStatusLabel(selectedStatusFilter)}"` : 'Aucune commande n\'a été effectuée pour le moment.' }}
                </p>
              </div>

              <!-- Orders list -->
              <div v-else class="space-y-4">
                <div v-for="order in filteredOrders" :key="order.id" class="bg-white border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900">
                        Commande #{{ order.id?.slice(-8).toUpperCase() }}
                      </h4>
                      <p class="text-sm text-gray-500">
                        {{ new Date(order.orderDate).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) }}
                      </p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span 
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(order.status)
                        ]"
                      >
                        {{ getStatusLabel(order.status) }}
                      </span>
                      
                      <!-- Dropdown pour changer le statut -->
                      <div class="relative status-dropdown">
                        <button 
                          @click="toggleStatusDropdown(order.id!)"
                          :disabled="updatingOrderStatus === order.id"
                          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                          <svg 
                            v-if="updatingOrderStatus === order.id"
                            class="animate-spin w-4 h-4 mr-1" 
                            fill="none" 
                            viewBox="0 0 24 24"
                          >
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <svg 
                            v-else
                            class="w-4 h-4 mr-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                          {{ updatingOrderStatus === order.id ? 'Mise à jour...' : 'Modifier' }}
                        </button>
                        
                        <!-- Dropdown menu -->
                        <div 
                          v-if="openStatusDropdown === order.id"
                          class="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50"
                          style="min-width: 200px; max-width: 250px;"
                        >
                          <div class="py-1">
                            <button 
                              v-for="status in availableStatuses" 
                              :key="status.value"
                              @click="updateOrderStatus(order.id!, status.value)"
                              class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                            >
                              <span 
                                :class="[
                                  'w-2 h-2 rounded-full mr-3 flex-shrink-0',
                                  getStatusColor(status.value).replace('bg-', '').replace('text-', 'bg-')
                                ]"
                              ></span>
                              <span class="truncate">{{ status.label }}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Order details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Items -->
                    <div>
                      <h5 class="text-sm font-medium text-gray-900 mb-3">Articles commandés</h5>
                      <div class="space-y-2">
                        <div 
                          v-for="item in order.items" 
                          :key="item.id"
                          class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <div class="flex items-center space-x-3">
                            <img 
                              v-if="item.photoUrl" 
                              :src="item.photoUrl" 
                              :alt="item.designation || item.codeArticle"
                              class="w-10 h-10 object-cover rounded-md"
                            />
                            <div v-else class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-900">{{ item.codeArticle }}</p>
                              <p class="text-xs text-gray-500">{{ item.designation || 'Sans désignation' }}</p>
                            </div>
                          </div>
                          <div class="text-sm text-gray-900 font-medium">
                            Qté: {{ item.quantity }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Shipping info -->
                    <div>
                      <h5 class="text-sm font-medium text-gray-900 mb-3">Adresse de livraison</h5>
                      <div class="text-sm text-gray-600 space-y-1">
                        <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                        <p v-if="order.shippingAddress.company">{{ order.shippingAddress.company }}</p>
                        <p>{{ order.shippingAddress.address }}</p>
                        <p>{{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}</p>
                        <p>{{ order.shippingAddress.country }}</p>
                        <p v-if="order.shippingAddress.phone">{{ order.shippingAddress.phone }}</p>
                      </div>
                      
                      <div v-if="order.notes" class="mt-4">
                        <h6 class="text-sm font-medium text-gray-900 mb-2">Notes</h6>
                        <p class="text-sm text-gray-600">{{ order.notes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </Tabs>
    </Card>
    
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
import type { Order, OrderStatus } from '~/types/cart'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import { useOrderService } from '~/services/orderService'
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
const orderService = useOrderService()
const { isModerator } = useAuth()

// Configuration des onglets
const settingsTabs = [
  { id: 'serrures', label: 'Serrures' },
  { id: 'types', label: 'Types' },
  { id: 'commandes', label: 'Commandes' }
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

// État pour la gestion des commandes
const orders = ref<Order[]>([])
const loadingOrders = ref(true)
const openStatusDropdown = ref<string | null>(null)
const updatingOrderStatus = ref<string | null>(null)
const selectedStatusFilter = ref<string | null>(null)

// Statuts disponibles pour les commandes
const availableStatuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' }
]

// Commandes filtrées par statut
const filteredOrders = computed(() => {
  if (!selectedStatusFilter.value) {
    return orders.value
  }
  return orders.value.filter(order => order.status === selectedStatusFilter.value)
})

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
    loadTypes(),
    loadOrders()
  ])
  
  // Fermer le dropdown quand on clique en dehors
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.status-dropdown')) {
      openStatusDropdown.value = null
    }
  })
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

// Fonctions pour la gestion des commandes
const loadOrders = async () => {
  try {
    loadingOrders.value = true
    // Charger toutes les commandes (pour les admins/moderators)
    orders.value = await orderService.getAllOrders()
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  } finally {
    loadingOrders.value = false
  }
}

// Fonctions utilitaires pour les statuts
const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  }
  return statusLabels[status] || status
}

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

// Fonctions pour la gestion des dropdowns de statut
const toggleStatusDropdown = (orderId: string) => {
  if (openStatusDropdown.value === orderId) {
    openStatusDropdown.value = null
  } else {
    openStatusDropdown.value = orderId
  }
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    updatingOrderStatus.value = orderId
    
    // Mettre à jour le statut dans Firestore
    await orderService.updateOrderStatus(orderId, newStatus as OrderStatus)
    
    // Mettre à jour la liste locale
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus as OrderStatus
    }
    
    // Fermer le dropdown
    openStatusDropdown.value = null
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  } finally {
    updatingOrderStatus.value = null
  }
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
.tab-content {
  margin-top: 2rem;
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