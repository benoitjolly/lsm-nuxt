<template>
  <div>
    <div class="mb-6 flex items-center">
      <button 
        @click="goBack"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        aria-label="Retour à la page précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>
    </div>
    
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      {{ serrure?.designation || 'Détails de la serrure' }}
    </h1>
    
    <div v-if="loading" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6 flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <div class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
      </div>
    </div>
    
    <div v-else-if="!serrure" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <div class="bg-yellow-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
      </div>
    </div>
    
    <div v-else>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ serrure.designation || 'Sans désignation' }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              <span v-if="serrure.typeSerrureNom" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                {{ serrure.typeSerrureNom }}
              </span>
              <span v-if="serrure.typeDeCle">Type de clé: {{ serrure.typeDeCle }}</span>
            </p>
          </div>
        </div>
        
        <div class="border-t border-gray-200">
          <div v-if="serrure.photoUrl" class="p-4">
            <img 
              :src="serrure.photoUrl" 
              :alt="`Photo de la serrure ${serrure.designation || serrure.codeArticle}`" 
              class="h-64 object-cover rounded-md mx-auto"
              loading="lazy"
              itemprop="image"
            />
          </div>
          
          <div v-if="serrure.planUrl" class="p-4 mt-2">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Plan de la serrure</h4>
            
            <div class="flex flex-col items-center">
              <!-- Image du plan (visible par défaut) -->
              <img 
                v-if="!imageLoadError"
                :src="serrure.planUrl" 
                :alt="`Plan technique de la serrure ${serrure.designation || serrure.codeArticle}`" 
                class="h-64 object-cover rounded-md mx-auto cursor-pointer"
                loading="lazy"
                @error="handleImageError"
                @click="openPlan"
              />
              
              <!-- Bouton d'ouverture du plan dans un nouvel onglet (si l'image ne charge pas) -->
             <div 
                v-if="imageLoadError"
                class="flex items-center gap-4 bg-gray-100 rounded-md p-4"
              >
                <!-- Bouton d'ouverture du plan -->
                <button 
                  @click="openPlan"
                  class="cursor-pointer flex flex-col items-center hover:opacity-80 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-indigo-600 mb-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span class="text-sm text-gray-700">Voir le plan</span>
                </button>
                
                <!-- Mini iframe pour aperçu -->
                <div class="h-332 w-232 border border-gray-300 bg-white rounded-md overflow-hidden shadow-sm">
                  <iframe 
                    v-if="serrure?.planUrl"
                    :src="serrure.planUrl" 
                    class="w-full h-full border-0" 
                    title="Aperçu du plan"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          
          <dl class="divide-y divide-gray-200">
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Code Article</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line" itemprop="sku">{{ serrure.codeArticle }}</dd>
            </div>
            <div v-if="serrure.typeSerrureNom" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Type de Serrure</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" itemprop="category">{{ serrure.typeSerrureNom }}</dd>
            </div>
            <div v-if="serrure.typeDeCle" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Type de Clé</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.typeDeCle }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Longueur du Corps</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span itemprop="additionalProperty" itemscope itemtype="https://schema.org/PropertyValue">
                  <meta itemprop="name" content="Longueur du Corps" />
                  <span itemprop="value">{{ serrure.longueurDuCorpsMm }}</span> mm
                </span>
              </dd>
            </div>
            <div v-if="serrure.diametre" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Diamètre</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span itemprop="additionalProperty" itemscope itemtype="https://schema.org/PropertyValue">
                  <meta itemprop="name" content="Diamètre" />
                  <span itemprop="value">{{ serrure.diametre }}</span> mm
                </span>
              </dd>
            </div>
            <div v-if="serrure.course" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Course</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.course }}</dd>
            </div>
            <div v-if="serrure.sens" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Sens</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.sens }}</dd>
            </div>
            <div v-if="serrure.sortieDeCle" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Sortie de Clé</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.sortieDeCle }}</dd>
            </div>
            <div v-if="serrure.fixationSerrure" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Fixation Serrure</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.fixationSerrure }}</dd>
            </div>
            <div v-if="serrure.pgPossible" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">PG Possible</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.pgPossible }}</dd>
            </div>
            <div v-if="serrure.typeDeCame" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Type de Came</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ serrure.typeDeCame }}</dd>
            </div>
          </dl>
        </div>
        
        <!-- Actions d'ajout au panier -->
        <div class="bg-gray-50 px-4 py-5 sm:px-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Ajouter au panier</h3>
            <div class="flex items-center space-x-4">
              <!-- Contrôles de quantité -->
              <div class="flex items-center space-x-2">
                <label for="quantity" class="text-sm font-medium text-gray-700">Quantité :</label>
                <div class="flex items-center space-x-1 bg-white rounded-md border border-gray-300 p-1">
                  <button 
                    @click="quantity > 1 && quantity--"
                    class="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                    :disabled="quantity <= 1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input 
                    v-model.number="quantity"
                    type="number" 
                    id="quantity"
                    min="1"
                    max="99"
                    class="w-16 text-center border-0 bg-transparent focus:ring-0 text-sm font-medium"
                  />
                  <button 
                    @click="quantity < 99 && quantity++"
                    class="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Bouton d'ajout -->
              <button 
                @click="handleAddToCart"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0H17" />
                </svg>
                Ajouter au panier
              </button>
            </div>
          </div>
          
          <!-- Statut du panier pour cet article -->
          <div v-if="isInCart(serrureId)" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-green-800">
                Cet article est dans votre panier ({{ getQuantityInCart(serrureId) }} {{ getQuantityInCart(serrureId) > 1 ? 'unités' : 'unité' }})
              </span>
              <NuxtLink 
                to="/panier"
                class="ml-2 text-sm text-green-600 hover:text-green-500 font-medium"
              >
                Voir le panier
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      

      
      <!-- Modal d'affichage du plan -->
      <div v-if="showPlanModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-5xl w-full h-5/6 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Plan de la serrure</h3>
            <button 
              @click="showPlanModal = false"
              class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Iframe pour afficher directement le contenu -->
          <div class="flex-1 bg-gray-100 rounded-md overflow-hidden">
            <iframe 
              v-if="serrure?.planUrl"
              :src="serrure.planUrl" 
              class="w-full h-full border-0" 
              allowfullscreen
            ></iframe>
          </div>
          
          <div class="flex justify-end space-x-3 mt-4">
            <button 
              @click="showPlanModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Fermer
            </button>
            <button 
              @click="openPlanInNewTab"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeoMeta, useHead } from 'unhead'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'
import useCart from '~/composables/useCart'
import { useSeoConfig } from '~/composables/useSeoConfig'


// Cette page est publique pour l'affichage, mais nécessite des droits de modérateur pour les modifications
definePageMeta({
  middleware: [],
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const serrure = ref<Serrure | null>(null)
const typeSerrure = ref<TypeSerrure | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const showPlanModal = ref(false)
const imageLoadError = ref(false)
const serrureService = useSerrureService()
const { getSerrureById } = useSerrureService()
const { getTypeSerrureById } = useTypeSerrureService()
const { isLoggedIn, isModerator } = useAuth()
const { addToCart, isInCart, getQuantityInCart } = useCart()

// État pour la quantité à ajouter au panier
const quantity = ref(1)

// Configuration SEO
const { 
  siteUrl, 
  siteName, 
  defaultProductImage,
  formatAuthor,
  getOgType,
  defaultLocale
} = useSeoConfig()

// ID de la serrure depuis l'URL
const serrureId = computed(() => route.params.id as string)

// Image principale pour SEO
const mainImage = computed(() => serrure.value?.photoUrl || defaultProductImage)

// Générer les données structurées pour Schema.org
const generateStructuredData = () => {
  if (!serrure.value) return {}

  // Propriétés additionnelles pour Schema.org
  const additionalProperties = []
  
  if (serrure.value.longueurDuCorpsMm) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Longueur du Corps",
      "value": `${serrure.value.longueurDuCorpsMm} mm`
    })
  }
  
  if (serrure.value.diametre) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Diamètre",
      "value": `${serrure.value.diametre} mm`
    })
  }
  
  if (serrure.value.fixationSerrure) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Fixation",
      "value": serrure.value.fixationSerrure
    })
  }
  
  if (serrure.value.typeDeCame) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Type de Came",
      "value": serrure.value.typeDeCame
    })
  }
  
  if (serrure.value.typeDeCle) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Type de Clé",
      "value": serrure.value.typeDeCle
    })
  }

  // Créer le schéma Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": serrure.value.designation || `Serrure ${serrure.value.codeArticle}`,
    "description": serrure.value.typeSerrureNom 
      ? `Serrure professionnelle de type ${serrure.value.typeSerrureNom}, code article: ${serrure.value.codeArticle}. Sécurité et fiabilité garanties pour vos installations.` 
      : `Serrure professionnelle de haute qualité, code article: ${serrure.value.codeArticle}. Solution de sécurité fiable et durable.`,
    "image": serrure.value.photoUrl || defaultProductImage,
    "sku": serrure.value.codeArticle,
    "brand": {
      "@type": "Brand",
      "name": siteName
    },
    "category": serrure.value.typeSerrureNom || "Serrure professionnelle",
    "url": `${siteUrl}/serrure/${serrure.value.id}`,
    "additionalProperty": additionalProperties
  }

  // Créer le schéma BreadcrumbList pour le fil d'Ariane
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": serrure.value.typeSerrureNom || "Serrures",
        "item": serrure.value.typeSerrureId ? `${siteUrl}/type/${serrure.value.typeSerrureId}` : `${siteUrl}/serrures`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": serrure.value.designation || serrure.value.codeArticle,
        "item": `${siteUrl}/serrure/${serrure.value.id}`
      }
    ]
  }

  return [productSchema, breadcrumbSchema]
}

// Charger les détails de la serrure
onMounted(async () => {
  loading.value = true
  error.value = null
  
  try {
    const id = route.params.id as string
    serrure.value = await getSerrureById(id)
    
    if (serrure.value?.typeSerrureId) {
      typeSerrure.value = await getTypeSerrureById(serrure.value.typeSerrureId)
    }
  } catch (err) {
    console.error('Erreur lors du chargement de la serrure:', err)
    error.value = 'Impossible de charger les détails de la serrure.'
  } finally {
    loading.value = false
  }
})



// Ouvrir la modale du plan
const openPlan = () => {
  if (!serrure.value?.planUrl) return
  showPlanModal.value = true
}

// Ouvrir le plan dans un nouvel onglet
const openPlanInNewTab = () => {
  if (!serrure.value?.planUrl) return
  
  try {
    window.open(serrure.value.planUrl, '_blank')
    showPlanModal.value = false
  } catch (err) {
    console.error('Erreur lors de l\'ouverture du plan:', err)
    error.value = 'Erreur lors de l\'ouverture du plan'
  }
}

// Gérer l'erreur de chargement d'image
const handleImageError = () => {
  imageLoadError.value = true
}

// Fonction pour revenir à la page précédente
const goBack = () => {
  router.back()
}

// Fonction pour ajouter au panier
const handleAddToCart = () => {
  if (serrure.value) {
    addToCart(serrure.value, quantity.value)
    // Optionnel : réinitialiser la quantité après ajout
    quantity.value = 1
  }
}
</script> 