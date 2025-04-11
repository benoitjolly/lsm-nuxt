<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Serrures de haute qualité</h1>
        <p class="text-sm text-gray-500 max-w-3xl">
          Découvrez notre gamme complète de serrures professionnelles. Sécurité, fiabilité et innovation au service de vos besoins.
        </p>
      </div>
      
      <ClientOnly>
        <div v-if="isLoggedIn && hasRole('admin')" class="mt-4 sm:mt-0">
          <NuxtLink to="/serrure" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150">
            Gestion des serrures
          </NuxtLink>
        </div>
      </ClientOnly>
    </div>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <!-- Pas besoin de contenu ici maintenant que le bouton a été déplacé -->
      </div>
      
      <ClientOnly>
        <div v-if="loading" class="px-4 py-12 flex justify-center items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        
        <div v-else class="px-4 py-5 sm:px-6">
          <!-- Champ de recherche -->
          <div class="mb-8 max-w-md mx-auto">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une serrure..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <!-- Affichage par type de serrure -->
          <div v-for="typeWithSerrures in typesAvecSerrures" :key="typeWithSerrures.id" class="mb-12 last:mb-0">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ typeWithSerrures.nom }}</h3>
              <NuxtLink :to="`/type/${typeWithSerrures.id}`" class="text-indigo-600 hover:text-indigo-900 flex items-center" :aria-label="`Voir toutes les serrures de type ${typeWithSerrures.nom}`">
                Voir tout
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
            
            <div class="relative">
              <!-- Liste horizontale des serrures de ce type -->
              <div class="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">
                <div v-for="serrure in typeWithSerrures.serrures" :key="serrure.id" class="flex-shrink-0 w-64">
                  <NuxtLink :to="`/serrure/${serrure.id}`" class="block rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300" :aria-label="`Détails de la serrure ${serrure.designation || 'Sans nom'}`">
                    <div class="w-full h-48 bg-gray-100">
                      <img
                        v-if="serrure.photoUrl"
                        :src="serrure.photoUrl"
                        :alt="`Photo de la serrure ${serrure.designation || serrure.codeArticle || 'Sans nom'}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-indigo-300" aria-hidden="true">
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
                <div v-if="typeWithSerrures.serrures.length === 0" class="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <p class="text-gray-500">Aucune serrure disponible pour ce type.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section pour les serrures sans type assigné -->
          <div v-if="serruresSansType.length > 0" class="mt-8">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Autres serrures</h3>
            
            <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              <div v-for="serrure in serruresSansType" :key="serrure.id" class="group relative">
                <NuxtLink :to="`/serrure/${serrure.id}`" class="block group cursor-pointer" :aria-label="`Détails de la serrure ${serrure.designation || 'Sans nom'}`">
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
                      <p class="mt-1 text-sm text-gray-500">{{ serrure.codeArticle }}</p>
                    </div>
                    
                    <p class="text-sm font-medium text-gray-900">{{ serrure.longueurDuCorpsMm }} mm</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Message si aucun produit -->
          <div v-if="filteredSerrures.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">Aucune serrure ne correspond à votre recherche.</p>
          </div>
          
          <div v-else-if="serrures.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">Aucune serrure disponible pour le moment.</p>
          </div>
        </div>

        <template #fallback>
          <div class="px-4 py-5 sm:px-6 text-center py-12">
            <p class="text-gray-500 text-lg">Chargement des données...</p>
          </div>
        </template>
      </ClientOnly>
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
import { useSeoMeta, useHead } from 'unhead'
import { useSeoConfig } from '~/composables/useSeoConfig'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'default'
})

// Interface pour les types avec leurs serrures
interface TypeWithSerrures extends TypeSerrure {
  serrures: Serrure[];
}

const serrures = ref<Serrure[]>([])
const types = ref<TypeSerrure[]>([])
const loading = ref(true)
const serrureService = useSerrureService()
const typeSerrureService = useTypeSerrureService()
const { isLoggedIn, hasRole } = useAuth()
const searchQuery = ref('')

// Configuration SEO
const { 
  siteUrl, 
  siteName, 
  defaultOgImage, 
  defaultTwitterImage, 
  formatAuthor, 
  twitterHandle,
  googleVerification 
} = useSeoConfig()

const baseTitle = `Serrures Professionnelles de Haute Qualité | Sécurité & Fiabilité | ${siteName}`
const baseDescription = 'Catalogue complet de serrures professionnelles pour applications résidentielles et industrielles. Découvrez nos serrures de haute qualité, fiables et sécurisées. Livraison rapide et service client expert.'

// Serrures filtrées par la recherche
const filteredSerrures = computed((): Serrure[] => {
  if (!searchQuery.value.trim()) {
    return serrures.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return serrures.value.filter(serrure => {
    return (
      (serrure.designation && serrure.designation.toLowerCase().includes(query)) ||
      (serrure.codeArticle && serrure.codeArticle.toLowerCase().includes(query)) ||
      (serrure.typeDeCle && serrure.typeDeCle.toLowerCase().includes(query)) ||
      (serrure.longueurDuCorpsMm && serrure.longueurDuCorpsMm.toString().includes(query)) ||
      (serrure.typeSerrureNom && serrure.typeSerrureNom.toLowerCase().includes(query))
    );
  });
});

// Grouper les serrures filtrées par type
const typesAvecSerrures = computed((): TypeWithSerrures[] => {
  const result: Record<string, TypeWithSerrures> = {};
  
  // Initialiser avec les types disponibles
  types.value.forEach(type => {
    if (type.id) {
      result[type.id] = { ...type, serrures: [] };
    }
  });
  
  // Associer les serrures filtrées à leur type
  filteredSerrures.value.forEach(serrure => {
    if (serrure.typeSerrureId && result[serrure.typeSerrureId]) {
      result[serrure.typeSerrureId].serrures.push(serrure);
    }
  });
  
  // Ne garder que les types qui ont au moins une serrure
  return Object.values(result).filter(type => type.serrures.length > 0);
});

// Serrures sans type assigné
const serruresSansType = computed((): Serrure[] => {
  return filteredSerrures.value.filter(serrure => !serrure.typeSerrureId);
});

// Charger les données uniquement côté client
onMounted(async () => {
  if (process.client) {
    try {
      const [serrugesData, typesData] = await Promise.all([
        serrureService.getAllSerrures(),
        typeSerrureService.getAllTypesSerrures()
      ]);
      
      serrures.value = serrugesData;
      types.value = typesData;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      loading.value = false;
    }
  }
});

// Données structurées pour le SEO
const generateStructuredData = () => {
  const typeItems = typesAvecSerrures.value.map(type => {
    // Récupérer les serrures de ce type
    const serrurenTypees = type.serrures.map(serrure => ({
      "@type": "Product",
      "name": serrure.designation || 'Serrure',
      "description": `Serrure professionnelle de type ${type.nom}, code article: ${serrure.codeArticle}`,
      "image": serrure.photoUrl || `${siteUrl}/placeholder-serrure.jpg`,
      "url": `${siteUrl}/serrure/${serrure.id}`,
      "brand": {
        "@type": "Brand",
        "name": siteName
      },
      "category": type.nom,
      "sku": serrure.codeArticle,
    }));

    return {
      "@type": "CollectionPage",
      "name": type.nom,
      "url": `${siteUrl}/type/${type.id}`,
      "description": type.description || `Collection de serrures ${type.nom}`,
      "hasPart": serrurenTypees
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "about": {
      "@type": "ItemList",
      "itemListElement": typeItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": item.url,
        "name": item.name
      }))
    }
  };
};

// Fonction pour générer les métadonnées pour le SEO
useSeoMeta({
  title: baseTitle,
  ogTitle: baseTitle,
  description: baseDescription,
  ogDescription: baseDescription,
  ogImage: defaultOgImage,
  twitterCard: 'summary_large_image',
  ogType: 'website',
  ogUrl: siteUrl,
  ogSiteName: siteName,
  twitterTitle: baseTitle,
  twitterDescription: baseDescription,
  twitterImage: defaultTwitterImage,
  articleAuthor: formatAuthor('Votre Entreprise'),
  articlePublishedTime: new Date().toISOString(),
  articleModifiedTime: new Date().toISOString(),
});

// Injecter les données structurées
useHead({
  title: baseTitle,
  htmlAttrs: {
    lang: 'fr'
  },
  meta: [
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'keywords', content: `serrures professionnelles, serrures haute qualité, serrures sécurisées, serrures industrielles, serrures résidentielles, ${types.value.map(type => type.nom).join(', ')}` },
    { name: 'author', content: siteName },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:creator', content: twitterHandle },
    { name: 'google', content: 'nositelinkssearchbox' },
    { name: 'google-site-verification', content: googleVerification }
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'alternate', href: siteUrl, hreflang: 'x-default' },
    { rel: 'alternate', href: siteUrl, hreflang: 'fr' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateStructuredData())
    }
  ]
});
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
