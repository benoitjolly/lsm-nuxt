<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex items-center">
      <NuxtLink 
        :to="isLoggedIn ? '/serrure' : '/'" 
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        aria-label="Retour à la liste des serrures"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ isLoggedIn ? 'Retour à la liste' : 'Retour à l\'accueil' }}
      </NuxtLink>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
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
    
    <div v-else-if="!serrure" class="bg-yellow-50 p-4 rounded-md">
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
    
    <div v-else>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        {{ serrure.designation || 'Serrure' }} - Code {{ serrure.codeArticle }}
      </h1>
      
      <div v-if="!showForm" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 class="text-lg leading-6 font-medium text-gray-900">
              {{ serrure.designation || 'Sans désignation' }}
            </h2>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              <span v-if="serrure.typeSerrureNom" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                {{ serrure.typeSerrureNom }}
              </span>
              <span v-if="serrure.typeDeCle">Type de clé: {{ serrure.typeDeCle }}</span>
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button 
              v-if="isLoggedIn"
              @click="editSerrure" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Modifier cette serrure"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button 
              v-if="isLoggedIn"
              @click="confirmDeleteSerrure" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Supprimer cette serrure"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
              :alt="`Photo de la serrure ${serrure.designation || serrure.codeArticle}`" 
              class="h-64 object-cover rounded-md mx-auto"
              loading="lazy"
              itemprop="image"
            />
          </div>
          
          <div v-if="serrure.planUrl" class="p-4 mt-2">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Plan de la serrure</h4>
            <img 
              :src="serrure.planUrl" 
              :alt="`Plan technique de la serrure ${serrure.designation || serrure.codeArticle}`" 
              class="h-64 object-cover rounded-md mx-auto"
              loading="lazy"
            />
          </div>
          
          <dl class="divide-y divide-gray-200">
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Code Article</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" itemprop="sku">{{ serrure.codeArticle }}</dd>
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
              @click="confirmDelete" 
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeoMeta, useHead } from 'unhead'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'
import { useSeoConfig } from '~/composables/useSeoConfig'

// Définir cette page comme publique (pas besoin de middleware)
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
const showForm = ref(false)
const showDeleteModal = ref(false)
const serrureService = useSerrureService()
const { getSerrureById } = useSerrureService()
const { getTypeSerrureById } = useTypeSerrureService()
const { isLoggedIn } = useAuth()

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

// Fonction pour supprimer une serrure
const handleDelete = async () => {
  if (!serrure.value?.id) return
  
  if (confirm('Êtes-vous sûr de vouloir supprimer cette serrure ?')) {
    try {
      await serrureService.deleteSerrure(serrure.value.id)
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la suppression de la serrure:', error)
    }
  }
}

// Charger les données
onMounted(async () => {
  try {
    loading.value = true
    const serrureData = await getSerrureById(serrureId.value)
    serrure.value = serrureData
    
    if (serrure.value?.typeSerrureId) {
      typeSerrure.value = await getTypeSerrureById(serrure.value.typeSerrureId)
    }
    
    if (serrure.value) {
      // Titre et description dynamiques pour SEO
      const productName = serrure.value.designation || `Serrure ${serrure.value.codeArticle}`
      const productType = serrure.value.typeSerrureNom || 'Professionnelle'
      const title = `${productName} | Serrure ${productType} de Haute Qualité | ${siteName}`
      
      // Description SEO enrichie avec caractéristiques du produit et mots-clés
      let description = `${productName} - Serrure professionnelle de haute qualité (Code: ${serrure.value.codeArticle})`
      if (serrure.value.longueurDuCorpsMm) {
        description += `, Longueur: ${serrure.value.longueurDuCorpsMm} mm`
      }
      if (serrure.value.typeSerrureNom) {
        description += `, Type: ${serrure.value.typeSerrureNom}`
      }
      if (serrure.value.typeDeCle) {
        description += `, Clé: ${serrure.value.typeDeCle}`
      }
      if (serrure.value.fixationSerrure) {
        description += `, Fixation: ${serrure.value.fixationSerrure}`
      }
      description += `. Solution de sécurité fiable et durable pour vos installations.`
      
      // Mots-clés dynamiques basés sur les attributs du produit
      let keywordsArray = [
        'serrure professionnelle', 
        'serrure haute qualité',
        'serrure sécurisée',
        serrure.value.codeArticle,
        productName
      ]
      
      if (serrure.value.typeSerrureNom) {
        keywordsArray.push(serrure.value.typeSerrureNom)
        keywordsArray.push(`serrure ${serrure.value.typeSerrureNom}`)
      }
      
      if (serrure.value.typeDeCle) {
        keywordsArray.push(serrure.value.typeDeCle)
      }
      
      if (serrure.value.fixationSerrure) {
        keywordsArray.push(`serrure ${serrure.value.fixationSerrure}`)
      }
      
      const keywords = keywordsArray.join(', ')
      
      // Configuration SEO optimisée
      useSeoMeta({
        title: title,
        ogTitle: title,
        description: description,
        ogDescription: description,
        ogImage: mainImage.value,
        twitterCard: 'summary_large_image',
        ogType: getOgType('product'),
        ogUrl: `${siteUrl}/serrure/${serrureId.value}`,
        ogSiteName: siteName,
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: mainImage.value,
        articleAuthor: formatAuthor(siteName),
        articlePublishedTime: new Date().toISOString(),
        articleModifiedTime: new Date().toISOString(),
      })
      
      // Configuration avancée avec données structurées
      useHead({
        title: title,
        htmlAttrs: {
          lang: 'fr'
        },
        meta: [
          { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          { name: 'keywords', content: keywords },
          { name: 'author', content: siteName },
          { property: 'og:locale', content: defaultLocale },
          { name: 'googlebot', content: 'index, follow' }
        ],
        link: [
          { rel: 'canonical', href: `${siteUrl}/serrure/${serrureId.value}` },
          { rel: 'alternate', href: `${siteUrl}/serrure/${serrureId.value}`, hreflang: 'x-default' },
          { rel: 'alternate', href: `${siteUrl}/serrure/${serrureId.value}`, hreflang: 'fr' }
        ],
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(generateStructuredData())
          }
        ]
      })
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    serrure.value = null
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
const handleFormSubmit = async (updatedSerrure: Serrure, photoFile?: File, planFile?: File) => {
  try {
    loading.value = true
    
    if (updatedSerrure.id) {
      await serrureService.updateSerrure(updatedSerrure.id, updatedSerrure, photoFile, planFile)
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
const confirmDelete = async () => {
  if (!serrure.value?.id) return
  
  try {
    loading.value = true
    showDeleteModal.value = false
    
    await serrureService.deleteSerrure(serrure.value.id)
    
    // Rediriger vers la liste des serrures si connecté, sinon vers l'accueil
    if (isLoggedIn) {
      router.push('/serrure')
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error('Erreur lors de la suppression de la serrure:', err)
    error.value = 'Erreur lors de la suppression'
    loading.value = false
  }
}
</script> 