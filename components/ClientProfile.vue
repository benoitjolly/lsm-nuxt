<template>
  <div>
    <Heading level="1" class="mb-6">Mon Profil</Heading>
    
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          Informations personnelles
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Détails de votre compte
        </p>
      </template>
      
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <DescriptionList>
          <DescriptionListItem 
            label="Nom d'utilisateur" 
            :value="userName" 
          />
          <DescriptionListItem 
            label="Email" 
            :value="userEmail" 
          />
          <DescriptionListItem 
            label="Dernière connexion" 
            :value="lastLoginTime" 
          />
        </DescriptionList>
      </div>
    </Card>

    <!-- Informations de commande -->
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          Informations de commande
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Adresse de livraison par défaut pour vos commandes
        </p>
      </template>
      
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <form @submit.prevent="saveShippingInfo">
          <DescriptionList>
            <DescriptionListItem label="Prénom *">
              <input 
                v-model="shippingAddress.firstName"
                type="text" 
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Votre prénom"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Nom *">
              <input 
                v-model="shippingAddress.lastName"
                type="text" 
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Votre nom"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Entreprise">
              <input 
                v-model="shippingAddress.company"
                type="text" 
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Nom de votre entreprise (optionnel)"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Adresse *">
              <input 
                v-model="shippingAddress.address"
                type="text" 
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Votre adresse complète"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Ville *">
              <input 
                v-model="shippingAddress.city"
                type="text" 
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Votre ville"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Code postal *">
              <input 
                v-model="shippingAddress.postalCode"
                type="text" 
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Code postal"
              />
            </DescriptionListItem>
            
            <DescriptionListItem label="Pays *">
              <select 
                v-model="shippingAddress.country"
                required
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none"
              >
                <option value="">Sélectionner un pays</option>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
              </select>
            </DescriptionListItem>
            
            <DescriptionListItem label="Téléphone">
              <input 
                v-model="shippingAddress.phone"
                type="tel" 
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 focus:border-none placeholder-gray-400"
                placeholder="Votre numéro de téléphone (optionnel)"
              />
            </DescriptionListItem>
          </DescriptionList>
          
          <!-- Message de statut -->
          <div v-if="saveMessage.type" class="mt-4">
            <div 
              :class="[
                'p-3 rounded-md text-sm',
                saveMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              ]"
            >
              <div class="flex items-center">
                <svg 
                  v-if="saveMessage.type === 'success'"
                  class="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg 
                  v-else
                  class="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ saveMessage.text }}
              </div>
            </div>
          </div>
          
          <!-- Bouton de sauvegarde -->
          <div v-if="hasChanges" class="flex justify-end mt-6">
            <button 
              type="submit"
              :disabled="savingShippingInfo"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
            >
              <svg 
                v-if="savingShippingInfo" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  class="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  stroke-width="4"
                />
                <path 
                  class="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ savingShippingInfo ? 'Sauvegarde en cours...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </Card>

    <!-- Historique des commandes -->
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          Mes Commandes
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Historique de vos commandes
        </p>
      </template>
      
      <div class="border-t border-gray-200">
        <!-- Loading state -->
        <div v-if="ordersLoading" class="p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Chargement des commandes...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="ordersError" class="p-6">
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <p class="mt-1 text-sm text-red-700">{{ ordersError }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="orders.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
          <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore passé de commande.</p>
          <div class="mt-6">
            <NuxtLink 
              to="/" 
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Parcourir les serrures
            </NuxtLink>
          </div>
        </div>
        
        <!-- Orders list -->
        <div v-else class="divide-y divide-gray-200">
          <div v-for="order in orders" :key="order.id" class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900">
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
                <button 
                  @click="toggleOrderDetails(order.id!)"
                  class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  {{ expandedOrders.includes(order.id!) ? 'Masquer' : 'Détails' }}
                </button>
              </div>
            </div>
            
            <!-- Order summary -->
            <div class="mt-4 text-sm text-gray-600">
              <span>{{ order.totalItems }} article{{ order.totalItems > 1 ? 's' : '' }}</span>
              <span class="mx-2">•</span>
              <span>{{ order.items.length }} référence{{ order.items.length > 1 ? 's' : '' }}</span>
            </div>
            
            <!-- Order details (expandable) -->
            <div v-if="expandedOrders.includes(order.id!)" class="mt-4 border-t border-gray-200 pt-4">
              <!-- Items -->
              <div class="space-y-3">
                <h5 class="text-sm font-medium text-gray-900">Articles commandés</h5>
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
              
              <!-- Shipping address -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <h5 class="text-sm font-medium text-gray-900 mb-2">Adresse de livraison</h5>
                <div class="text-sm text-gray-600">
                  <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                  <p v-if="order.shippingAddress.company">{{ order.shippingAddress.company }}</p>
                  <p>{{ order.shippingAddress.address }}</p>
                  <p>{{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}</p>
                  <p>{{ order.shippingAddress.country }}</p>
                  <p v-if="order.shippingAddress.phone">{{ order.shippingAddress.phone }}</p>
                </div>
              </div>
              
              <!-- Notes -->
              <div v-if="order.notes" class="mt-4 pt-4 border-t border-gray-200">
                <h5 class="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                <p class="text-sm text-gray-600">{{ order.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <template #header>
        <Heading level="3">
          Actions du compte
        </Heading>
        <div class="mt-5">
          <Button 
            @click="handleLogout" 
            variant="danger"
            size="base"
          >
            Déconnexion
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'
import { useOrderService } from '~/services/orderService'
import type { Order, OrderStatus, ShippingAddress } from '~/types/cart'
import { Button, Card, Heading, DescriptionList, DescriptionListItem } from '~/design-system/components'

const emit = defineEmits(['logout'])

const { user, logout, isLoggedIn } = useAuth()
const { getUserOrders } = useOrderService()
const router = useRouter()

// État pour les commandes
const orders = ref<Order[]>([])
const ordersLoading = ref(false)
const ordersError = ref<string | null>(null)
const expandedOrders = ref<string[]>([])

// État pour les informations de commande
const shippingAddress = ref<ShippingAddress>({
  firstName: '',
  lastName: '',
  company: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  phone: ''
})
const originalShippingAddress = ref<ShippingAddress>({
  firstName: '',
  lastName: '',
  company: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  phone: ''
})
const savingShippingInfo = ref(false)
const saveMessage = ref<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' })

// Vérifier l'authentification au montage
onMounted(async () => {
  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
  if (!isLoggedIn.value) {
    router.push('/')
    return
  }
  
  // Charger les données de l'utilisateur seulement côté client
  if (typeof window !== 'undefined') {
    await Promise.all([
      loadUserOrders(),
      loadShippingInfo()
    ])
  }
})

// Charger les commandes de l'utilisateur
const loadUserOrders = async () => {
  if (!user.value) return
  
  ordersLoading.value = true
  ordersError.value = null
  
  try {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      orders.value = []
      return
    }
    
    orders.value = await getUserOrders(user.value.uid, 20) // Limite de 20 commandes
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
    ordersError.value = 'Impossible de charger vos commandes.'
  } finally {
    ordersLoading.value = false
  }
}

// Charger les informations de commande de l'utilisateur
const loadShippingInfo = async () => {
  if (!user.value) return
  
  try {
    // Pour l'instant, on charge depuis localStorage
    // Plus tard, on pourra charger depuis Firestore
    const stored = localStorage.getItem(`shipping_${user.value.uid}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      shippingAddress.value = { ...parsed }
      originalShippingAddress.value = { ...parsed }
    } else {
      originalShippingAddress.value = { ...shippingAddress.value }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des informations de commande:', error)
  }
}

// Sauvegarder les informations de commande
const saveShippingInfo = async () => {
  if (!user.value) return
  
  savingShippingInfo.value = true
  saveMessage.value = { type: null, text: '' }
  
  try {
    // Simuler un délai de sauvegarde pour une meilleure UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`shipping_${user.value.uid}`, JSON.stringify(shippingAddress.value))
    
    // Plus tard, on pourra sauvegarder dans Firestore
    // await saveUserShippingInfo(user.value.uid, shippingAddress.value)
    
    // Afficher un message de succès
    saveMessage.value = { type: 'success', text: 'Informations sauvegardées avec succès !' }
    
    // Mettre à jour l'état original après sauvegarde
    originalShippingAddress.value = { ...shippingAddress.value }
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      saveMessage.value = { type: null, text: '' }
    }, 3000)
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des informations de commande:', error)
    saveMessage.value = { type: 'error', text: 'Erreur lors de la sauvegarde. Veuillez réessayer.' }
  } finally {
    savingShippingInfo.value = false
  }
}

// Vérifier s'il y a des modifications
const hasChanges = computed(() => {
  return JSON.stringify(shippingAddress.value) !== JSON.stringify(originalShippingAddress.value)
})

const userName = computed(() => {
  if (!user.value) return 'Utilisateur'
  return user.value.displayName || user.value.email?.split('@')[0] || ''
})

const userEmail = computed(() => {
  if (!user.value) return 'Non disponible'
  return user.value.email || ''
})

const lastLoginTime = computed(() => {
  if (!user.value || !user.value.metadata?.lastSignInTime) return 'Inconnue'
  return new Date(user.value.metadata.lastSignInTime).toLocaleString('fr-FR')
})

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    emit('logout')
    router.push('/')
  }
}

// Fonctions utilitaires pour les commandes
const toggleOrderDetails = (orderId: string) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'processing':
      return 'En traitement'
    case 'shipped':
      return 'Expédiée'
    case 'delivered':
      return 'Livrée'
    case 'cancelled':
      return 'Annulée'
    default:
      return 'Statut inconnu'
  }
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script> 