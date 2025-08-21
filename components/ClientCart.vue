<template>
  <div ref="cartContainer">
    <Heading level="1" class="mb-6">Mon Panier</Heading>
    <p class="text-sm text-gray-500 max-w-3xl mb-8">
      Finalisez votre commande en 3 étapes simples
    </p>

    <!-- Indicateur d'étapes -->
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          Progression de la commande
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Suivez les étapes pour finaliser votre commande
        </p>
      </template>
      
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        <StepperProgress 
          :steps="steps" 
          :show-descriptions="true"
          size="md"
          variant="default"
        />
      </div>
    </Card>

    <!-- Contenu selon l'étape -->
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          {{ getStepTitle() }}
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ getStepDescription() }}
        </p>
      </template>
      
      <div class="border-t border-gray-200">
        <!-- Étape 1: Articles du panier -->
        <div v-if="currentStep === 1" class="px-4 py-5 sm:p-6">
          <div v-if="isEmpty" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Votre panier est vide</h3>
            <p class="mt-1 text-sm text-gray-500">Commencez par ajouter des serrures à votre panier.</p>
            <div class="mt-6">
              <NuxtLink 
                to="/" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Parcourir les serrures
              </NuxtLink>
            </div>
          </div>

          <div v-else>
            <h2 class="text-lg font-medium text-gray-900 mb-6">Articles sélectionnés ({{ itemCount }})</h2>
            
            <div class="space-y-4">
              <div 
                v-for="item in items" 
                :key="item.id"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex-shrink-0">
                  <img 
                    v-if="item.photoUrl" 
                    :src="item.photoUrl" 
                    :alt="item.designation || item.codeArticle"
                    class="h-16 w-16 object-cover rounded-md"
                  />
                  <div v-else class="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900">{{ item.codeArticle }}</h4>
                  <p class="text-sm text-gray-500">{{ item.designation || 'Sans désignation' }}</p>
                  <span v-if="item.typeSerrureNom" class="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                    {{ item.typeSerrureNom }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button 
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    :disabled="item.quantity <= 1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  @click="removeFromCart(item.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mt-8 flex justify-between items-center">
              <button 
                @click="clearCart"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Vider le panier
              </button>
              <div class="flex space-x-3">
                <NuxtLink 
                  v-if="!isLoggedIn"
                  to="/login?redirect=/panier"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Se connecter pour continuer
                </NuxtLink>
                <button 
                  v-else
                  @click="nextStep"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors duration-150"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 2: Informations de livraison -->
        <div v-else-if="currentStep === 2" class="px-4 py-5 sm:p-0">
          <div v-if="!isLoggedIn" class="space-y-6">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Connexion requise</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Vous devez être connecté pour continuer.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NuxtLink 
                to="/login?redirect=/panier"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
              >
                Se connecter
              </NuxtLink>
              <NuxtLink 
                to="/register?redirect=/panier"
                class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
              >
                Créer un compte
              </NuxtLink>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- Formulaire d'adresse de livraison avec DescriptionList -->
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

            <!-- Notes de commande -->
            <div class="mt-6">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">Notes de commande (optionnel)</label>
              <textarea 
                v-model="orderNotes"
                id="notes"
                rows="3"
                class="block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Informations complémentaires pour votre commande..."
              ></textarea>
            </div>

            <div class="flex justify-between mt-6">
              <button 
                @click="previousStep"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Retour
              </button>
              <button 
                @click="nextStep"
                :disabled="!isShippingInfoComplete"
                class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>

        <!-- Étape 3: Résumé de la commande -->
        <div v-else-if="currentStep === 3" class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Résumé de la commande</h2>
          
          <div class="space-y-6">
            <!-- Récapitulatif des articles -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-md font-medium text-gray-900 mb-4">Articles commandés</h3>
              <div class="space-y-3">
                <div v-for="item in items" :key="item.id" class="flex justify-between items-center">
                  <div class="flex items-center space-x-3">
                    <img 
                      v-if="item.photoUrl" 
                      :src="item.photoUrl" 
                      :alt="item.designation || item.codeArticle"
                      class="h-12 w-12 object-cover rounded-md"
                    />
                    <div v-else class="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ item.codeArticle }}</p>
                      <p class="text-xs text-gray-500">{{ item.designation || 'Sans désignation' }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">Quantité: {{ item.quantity }}</p>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Total d'articles :</span>
                  <span class="font-medium">{{ itemCount }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Références :</span>
                  <span class="font-medium">{{ items.length }}</span>
                </div>
              </div>
            </div>

            <!-- Adresse de livraison -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-md font-medium text-gray-900 mb-4">Adresse de livraison</h3>
              <div class="text-sm text-gray-700 space-y-1">
                <p><strong>{{ shippingAddress.firstName }} {{ shippingAddress.lastName }}</strong></p>
                <p v-if="shippingAddress.company">{{ shippingAddress.company }}</p>
                <p>{{ shippingAddress.address }}</p>
                <p>{{ shippingAddress.postalCode }} {{ shippingAddress.city }}</p>
                <p>{{ shippingAddress.country }}</p>
                <p v-if="shippingAddress.phone">Tél: {{ shippingAddress.phone }}</p>
              </div>
            </div>

            <!-- Notes de commande -->
            <div v-if="orderNotes" class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-md font-medium text-gray-900 mb-4">Notes de commande</h3>
              <p class="text-sm text-gray-700">{{ orderNotes }}</p>
            </div>

            <div class="flex justify-between">
              <button 
                @click="previousStep"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Retour
              </button>
              <button 
                @click="submitOrder"
                :disabled="submitting"
                class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
              >
                {{ submitting ? 'Envoi en cours...' : 'Confirmer et envoyer la commande' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Commande envoyée !</h3>
        <p class="text-sm text-gray-500 text-center mb-6">
          Votre commande a été envoyée avec succès. Vous recevrez une confirmation par email.
        </p>
        <div class="flex space-x-3">
          <NuxtLink 
            to="/profile"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Voir mes commandes
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Continuer les achats
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import useCart from '../composables/useCart'
import useAuth from '../composables/useAuth'
import { useOrderService } from '../services/orderService'
import type { ShippingAddress, CartStep } from '../types/cart'
import StepperProgress from './StepperProgress.vue'
import { Card, Heading, DescriptionList, DescriptionListItem } from '~/design-system/components'

const { 
  items, 
  isEmpty, 
  itemCount, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  createOrderFromCart
} = useCart()

const { isLoggedIn, user } = useAuth()
const { createOrder } = useOrderService()

// Référence au conteneur du panier
const cartContainer = ref<HTMLElement>()

// État des étapes
const currentStep = ref(1)
const submitting = ref(false)
const showConfirmation = ref(false)

// Données du formulaire
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

const orderNotes = ref('')

// Charger les informations de l'utilisateur
const loadUserShippingInfo = async () => {
  if (!user.value) return
  
  try {
    // Charger depuis localStorage
    const stored = localStorage.getItem(`shipping_${user.value.uid}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      shippingAddress.value = { ...parsed }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des informations de livraison:', error)
  }
}

// Vérifier si les informations de livraison sont complètes
const isShippingInfoComplete = computed(() => {
  return shippingAddress.value.firstName.trim() !== '' &&
         shippingAddress.value.lastName.trim() !== '' &&
         shippingAddress.value.address.trim() !== '' &&
         shippingAddress.value.city.trim() !== '' &&
         shippingAddress.value.postalCode.trim() !== '' &&
         shippingAddress.value.country.trim() !== ''
})

// Configuration des étapes
const steps = computed((): CartStep[] => [
  {
    id: 1,
    title: 'Articles',
    description: 'Vérifiez vos articles',
    completed: currentStep.value > 1,
    current: currentStep.value === 1
  },
  {
    id: 2,
    title: 'Livraison',
    description: 'Adresse de livraison',
    completed: currentStep.value > 2,
    current: currentStep.value === 2
  },
  {
    id: 3,
    title: 'Résumé',
    description: 'Confirmation',
    completed: currentStep.value > 3,
    current: currentStep.value === 3
  }
])

// Navigation entre les étapes
const nextStep = () => {
  if (currentStep.value === 1 && isEmpty.value) {
    return // Ne pas passer à l'étape suivante si le panier est vide
  }
  if (currentStep.value === 1 && !isLoggedIn.value) {
    return // Ne pas passer à l'étape suivante si pas connecté
  }
  if (currentStep.value === 2 && !isShippingInfoComplete.value) {
    return // Ne pas passer à l'étape suivante si les informations de livraison ne sont pas complètes
  }
  if (currentStep.value < 3) {
    currentStep.value++
    // Scroll vers le haut du composant après le rendu
    nextTick(() => {
      if (cartContainer.value) {
        cartContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    // Scroll vers le haut du composant après le rendu
    nextTick(() => {
      if (cartContainer.value) {
        cartContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

// Soumission de la commande
const submitOrder = async () => {
  if (submitting.value) return
  
  try {
    submitting.value = true
    
    // Créer la commande
    const order = createOrderFromCart(shippingAddress.value, orderNotes.value)
    
    // Sauvegarder en base
    const orderId = await createOrder(order)
    
    // Vider le panier
    clearCart()
    
    // Afficher la confirmation
    showConfirmation.value = true
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    // TODO: Afficher un message d'erreur à l'utilisateur
  } finally {
    submitting.value = false
  }
}

// Surveiller la connexion pour charger les informations et passer automatiquement à l'étape suivante
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    // Charger les informations de l'utilisateur
    await loadUserShippingInfo()
    
    if (currentStep.value === 2) {
      // Auto-avancer à l'étape 3 quand l'utilisateur se connecte
      setTimeout(() => {
        nextStep()
      }, 1000)
    }
  }
})

// Surveiller l'étape pour charger les informations quand on arrive à l'étape 2
watch(currentStep, async (newStep) => {
  if (newStep === 2 && isLoggedIn.value) {
    await loadUserShippingInfo()
  }
})

// Charger les informations au montage si l'utilisateur est déjà connecté
onMounted(async () => {
  if (isLoggedIn.value) {
    await loadUserShippingInfo()
  }
})

// Fonctions pour les titres et descriptions des étapes
const getStepTitle = () => {
  switch (currentStep.value) {
    case 1: return 'Articles sélectionnés'
    case 2: return 'Informations de livraison'
    case 3: return 'Résumé de la commande'
    default: return 'Étape'
  }
}

const getStepDescription = () => {
  switch (currentStep.value) {
    case 1: return 'Vérifiez et ajustez les quantités de vos articles'
    case 2: return 'Remplissez vos informations de livraison'
    case 3: return 'Vérifiez votre commande avant envoi'
    default: return ''
  }
}
</script>
