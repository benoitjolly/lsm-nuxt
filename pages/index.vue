<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Serrures de haute qualité
      </h1>
      <p class="text-lg text-gray-500 max-w-3xl mb-12">
        Découvrez notre gamme complète de serrures professionnelles. Sécurité, fiabilité et innovation au service de vos besoins.
      </p>
      
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else>
        <!-- Grille de produits -->
        <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <div v-for="serrure in serrures" :key="serrure.id" class="group relative">
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
                <h3 class="text-sm text-gray-700 font-medium">
                  <NuxtLink :to="`/serrure/${serrure.id}`" class="hover:text-indigo-600">
                    {{ serrure.designation || 'Serrure' }}
                  </NuxtLink>
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ serrure.codeArticle }}</p>
                <div class="mt-2">
                  <span v-if="serrure.typeSerrureNom" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ serrure.typeSerrureNom }}
                  </span>
                </div>
              </div>
              
              <p class="text-sm font-medium text-gray-900">{{ serrure.longueurDuCorpsMm }} mm</p>
            </div>
            
            <div class="mt-3 flex space-x-2">
              <NuxtLink
                :to="`/serrure/${serrure.id}`"
                class="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
              >
                Détails
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
import { ref, onMounted } from 'vue'
import type { Serrure } from '~/types/serrure'
import { useSerrureService } from '~/services/serrureService'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'default'
})

const serrures = ref<Serrure[]>([])
const loading = ref(true)
const serrureService = useSerrureService()

// Charger les serrures au montage du composant
onMounted(async () => {
  try {
    serrures.value = await serrureService.getAllSerrures()
  } catch (error) {
    console.error('Erreur lors du chargement des serrures:', error)
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
</style>
