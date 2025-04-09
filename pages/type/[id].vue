<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="mb-6 flex items-center">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </NuxtLink>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else-if="!typeSerrure" class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
      
      <div v-else>
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {{ typeSerrure.nom }}
          </h1>
          
          <div v-if="isLoggedIn">
            <NuxtLink to="/serrure" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150">
              Administration
            </NuxtLink>
          </div>
          <div v-else>
            <NuxtLink to="/login" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150">
              Connexion
            </NuxtLink>
          </div>
        </div>
        
        <p v-if="typeSerrure.description" class="text-lg text-gray-500 max-w-3xl mb-12">
          {{ typeSerrure.description }}
        </p>
        
        <!-- Grille de produits -->
        <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <div v-for="serrure in filteredSerrures" :key="serrure.id" class="group relative">
            <NuxtLink :to="`/serrure/${serrure.id}`" class="block group cursor-pointer">
              <div class="w-full bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  v-if="serrure.photoUrl"
                  :src="serrure.photoUrl"
                  :alt="serrure.designation || 'Serrure'"
                  class="w-full h-full object-center object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-indigo-300">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700 font-medium group-hover:text-indigo-600">
                    {{ serrure.designation || 'Serrure' }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">{{ serrure.codeArticle }}</p>
                </div>
                
                <p class="text-sm font-medium text-gray-900">{{ serrure.longueurDuCorpsMm }} mm</p>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Message si aucun produit -->
        <div v-if="filteredSerrures.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Aucune serrure disponible pour ce type.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'
import { useHead } from 'unhead'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'default'
})

const route = useRoute()
const serrures = ref<Serrure[]>([])
const typeSerrure = ref<TypeSerrure | null>(null)
const loading = ref(true)
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()
const { isLoggedIn } = useAuth()

// ID du type depuis l'URL
const typeId = computed(() => route.params.id as string)

// Serrures filtrées par type
const filteredSerrures = computed(() => {
  return serrures.value.filter(serrure => serrure.typeSerrureId === typeId.value)
})

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
    
    // Générer les métadonnées SEO dynamiquement
    if (typeSerrure.value) {
      useHead({
        title: `${typeSerrure.value.nom} - Serrures de haute qualité`,
        meta: [
          { name: 'description', content: typeSerrure.value.description || `Découvrez notre gamme complète de serrures ${typeSerrure.value.nom}. Sécurité, fiabilité et innovation au service de vos besoins.` },
          { property: 'og:title', content: `${typeSerrure.value.nom} - Serrures de haute qualité` },
          { property: 'og:description', content: typeSerrure.value.description || `Découvrez notre gamme complète de serrures ${typeSerrure.value.nom}. Sécurité, fiabilité et innovation au service de vos besoins.` },
          { property: 'og:type', content: 'website' }
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