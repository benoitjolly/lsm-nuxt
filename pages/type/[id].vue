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
    
    <div v-if="loading" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6 flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="!typeSerrure" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <div class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Type de serrure non trouvé</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>Le type de serrure demandé n'existe pas ou a été supprimé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ typeSerrure.nom }}</h1>
        <p v-if="typeSerrure.description" class="text-sm text-gray-500 max-w-3xl">
          {{ typeSerrure.description }}
        </p>
      </div>
      
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
          <!-- Grille de produits -->
          <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div v-for="serrure in filteredSerrures" :key="serrure.id" class="group relative">
              <div class="block group cursor-pointer">
                <NuxtLink :to="`/serrure/${serrure.id}`" class="block" :aria-label="`Détails de la serrure ${serrure.designation || 'Sans nom'}`">
                  <div class="w-full bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 transition-shadow duration-300 group-hover:shadow-lg">
                    <img
                      v-if="serrure.photoUrl"
                      :src="serrure.photoUrl"
                      :alt="`Photo de la serrure ${serrure.designation || serrure.codeArticle || 'Sans nom'}`"
                      class="w-full h-full object-center object-cover"
                      loading="lazy"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-indigo-300" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex justify-between">
                    <div>
                      <h3 class="text-sm text-gray-700 font-medium group-hover:text-indigo-600">
                        {{ serrure.designation || 'Serrure' }}
                      </h3>
                      <p class="mt-1 text-sm text-gray-500 whitespace-pre-line">{{ serrure.codeArticle }}</p>
                    </div>
                    
                    <p class="text-sm font-medium text-gray-900">{{ serrure.longueurDuCorpsMm }} mm</p>
                  </div>
                </NuxtLink>
                
                <!-- Section d'ajout au panier -->
                <div class="mt-4">
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="quantities[serrure.id || '']"
                      type="number"
                      min="1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Qté"
                    />
                    <button
                      @click="handleAddToCart(serrure)"
                      class="flex-1 bg-indigo-600 text-white text-sm px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-150"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Message si aucun produit -->
          <div v-if="filteredSerrures.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">Aucune serrure disponible pour ce type.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'
import useCart from '~/composables/useCart'
import { useSeoMeta } from 'unhead'
import { useSeoConfig } from '~/composables/useSeoConfig'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const serrures = ref<Serrure[]>([])
const typeSerrure = ref<TypeSerrure | null>(null)
const loading = ref(true)
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()
const { isLoggedIn, isAdmin } = useAuth()
const { addToCart } = useCart()
const quantities = ref<Record<string, number>>({})

// Fonction pour ajouter une serrure au panier
const handleAddToCart = (serrure: Serrure) => {
  if (!serrure.id) return
  
  const quantity = quantities.value[serrure.id] || 1
  addToCart(serrure, quantity)
  
  // Réinitialiser la quantité
  quantities.value[serrure.id] = 1
}

// Configuration SEO
const { 
  siteUrl, 
  siteName, 
  defaultProductImage, 
  formatAuthor, 
  getOgType,
  defaultLocale
} = useSeoConfig()

// ID du type depuis l'URL
const typeId = computed(() => route.params.id as string)

// Serrures filtrées par type
const filteredSerrures = computed(() => {
  return serrures.value.filter(serrure => serrure.typeSerrureId === typeId.value)
})

// Image pour les partages sociaux (première image de la catégorie ou image par défaut)
const categoryImage = computed(() => {
  return filteredSerrures.value.length > 0 && filteredSerrures.value[0].photoUrl
    ? filteredSerrures.value[0].photoUrl
    : defaultProductImage
})

// Générer les données structurées pour Schema.org
const generateStructuredData = () => {
  if (!typeSerrure.value) return {}

  // Créer un tableau d'éléments pour chaque serrure
  const itemListElement = filteredSerrures.value.map((serrure, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": serrure.designation || 'Serrure',
      "description": `Serrure professionnelle de type ${typeSerrure.value?.nom || ''}, code article: ${serrure.codeArticle}`,
      "image": serrure.photoUrl || defaultProductImage,
      "url": `${siteUrl}/serrure/${serrure.id}`,
      "brand": {
        "@type": "Brand",
        "name": siteName
      },
      "category": typeSerrure.value?.nom,
      "sku": serrure.codeArticle
    }
  }))

  // Créer le schéma principal de type ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Serrures de type ${typeSerrure.value.nom}`,
    "description": typeSerrure.value.description || `Collection de serrures professionnelles de type ${typeSerrure.value.nom}`,
    "numberOfItems": itemListElement.length,
    "itemListElement": itemListElement
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
        "name": typeSerrure.value.nom,
        "item": `${siteUrl}/type/${typeId.value}`
      }
    ]
  }

  return [itemListSchema, breadcrumbSchema]
}

// Charger les données
onMounted(async () => {
  try {
    loading.value = true
    
    // Charger les serrures et le type en parallèle
    const [serrugesData, typeData] = await Promise.all([
      serrureService.getAllSerrures(),
      typeSerrureService.getTypeSerrureById(typeId.value)
    ])
    
    serrures.value = serrugesData
    typeSerrure.value = typeData
    
    if (typeSerrure.value) {
      const title = `${typeSerrure.value.nom} - Serrures de haute qualité | ${siteName}`
      const description = typeSerrure.value.description || 
        `Découvrez notre gamme complète de serrures ${typeSerrure.value.nom}. Sécurité, fiabilité et innovation au service de vos besoins.`
        
      // Keywords générés dynamiquement à partir des serrures de cette catégorie
      const keywords = `serrures, ${typeSerrure.value.nom}, serrures professionnelles, sécurité, ${filteredSerrures.value.map(s => s.designation || s.codeArticle).join(', ')}`

      // Configuration SEO optimisée
      useSeoMeta({
        title: title,
        ogTitle: title,
        description: description,
        ogDescription: description,
        ogImage: categoryImage.value,
        twitterCard: 'summary_large_image',
        ogType: getOgType('website'),
        ogUrl: `${siteUrl}/type/${typeId.value}`,
        ogSiteName: siteName,
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: categoryImage.value,
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
          { rel: 'canonical', href: `${siteUrl}/type/${typeId.value}` },
          { rel: 'alternate', href: `${siteUrl}/type/${typeId.value}`, hreflang: 'x-default' },
          { rel: 'alternate', href: `${siteUrl}/type/${typeId.value}`, hreflang: 'fr' }
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
    typeSerrure.value = null
  } finally {
    loading.value = false
  }
})

// Fonction pour revenir à la page précédente
const goBack = () => {
  router.back()
}
</script>

<style>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-w-1 img,
.aspect-w-1 > div {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style> 