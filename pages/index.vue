<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Serrures de haute qualité
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
      
      <p class="text-lg text-gray-500 max-w-3xl mb-12">
        Découvrez notre gamme complète de serrures professionnelles. Sécurité, fiabilité et innovation au service de vos besoins.
      </p>
      
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else>
        <!-- Affichage par type de serrure -->
        <div v-for="(type, index) in typesAvecSerrures" :key="type.id" class="mb-12 last:mb-0">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ type.nom }}</h2>
            <NuxtLink :to="`/type/${type.id}`" class="text-indigo-600 hover:text-indigo-900 flex items-center">
              Voir tout
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
          
          <div class="relative">
            <!-- Liste horizontale des serrures de ce type -->
            <div class="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">
              <div v-for="serrure in type.id && typeSerrures[type.id] ? typeSerrures[type.id] : []" :key="serrure.id" class="flex-shrink-0 w-64">
                <NuxtLink :to="`/serrure/${serrure.id}`" class="block rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
                  <div class="w-full h-48 bg-gray-100">
                    <img
                      v-if="serrure.photoUrl"
                      :src="serrure.photoUrl"
                      :alt="serrure.designation || 'Serrure'"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-indigo-300">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                      {{ serrure.designation || 'Serrure' }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">{{ serrure.codeArticle }}</p>
                    <p class="mt-2 text-sm font-medium text-gray-900">{{ serrure.longueurDuCorpsMm }} mm</p>
                  </div>
                </NuxtLink>
              </div>
              
              <!-- Message si aucune serrure pour ce type -->
              <div v-if="!type.id || (typeSerrures[type.id] && typeSerrures[type.id].length === 0)" class="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <p class="text-gray-500">Aucune serrure disponible pour ce type.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Section pour les serrures sans type assigné -->
        <div v-if="serruresSansType.length > 0" class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Autres serrures</h2>
          
          <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div v-for="serrure in serruresSansType" :key="serrure.id" class="group relative">
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
        </div>
        
        <!-- Message si aucun produit -->
        <div v-if="serrures.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Aucune serrure disponible pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Serrure } from '~/types/serrure'
import type { TypeSerrure } from '~/types/typeSerrure'
import { useSerrureService } from '~/services/serrureService'
import { useTypeSerrureService } from '~/services/typeSerrureService'
import useAuth from '~/composables/useAuth'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'default'
})

const serrures = ref<Serrure[]>([])
const types = ref<TypeSerrure[]>([])
const loading = ref(true)
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()
const { isLoggedIn } = useAuth()

// Regrouper les serrures par type
const typeSerrures = computed(() => {
  const result: { [key: string]: Serrure[] } = {}
  
  // Initialiser les tableaux vides pour tous les types
  types.value.forEach(type => {
    if (type.id) {
      result[type.id] = []
    }
  })
  
  // Remplir les tableaux avec les serrures correspondantes
  serrures.value.forEach(serrure => {
    if (serrure.typeSerrureId) {
      if (!result[serrure.typeSerrureId]) {
        result[serrure.typeSerrureId] = []
      }
      result[serrure.typeSerrureId].push(serrure)
    }
  })
  
  return result
})

// Filtrer les types qui ont au moins une serrure associée
const typesAvecSerrures = computed(() => {
  return types.value.filter(type => {
    return type.id && typeSerrures.value[type.id]?.length > 0
  })
})

// Serrures sans type assigné
const serruresSansType = computed(() => {
  return serrures.value.filter(serrure => !serrure.typeSerrureId)
})

// Charger les données au montage du composant
onMounted(async () => {
  try {
    const [serrugesData, typesData] = await Promise.all([
      serrureService.getAllSerrures(),
      typeSerrureService.getAllTypesSerrures()
    ])
    
    serrures.value = serrugesData
    types.value = typesData
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})

// Fonction pour générer les métadonnées pour le SEO
useHead({
  title: 'Serrures de haute qualité - Accueil',
  meta: [
    { name: 'description', content: 'Découvrez notre gamme complète de serrures professionnelles. Sécurité, fiabilité et innovation au service de vos besoins.' },
    { property: 'og:title', content: 'Serrures de haute qualité - Accueil' },
    { property: 'og:description', content: 'Découvrez notre gamme complète de serrures professionnelles. Sécurité, fiabilité et innovation au service de vos besoins.' },
    { property: 'og:type', content: 'website' }
  ]
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

/* Style pour la barre de défilement */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
