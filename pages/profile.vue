<template>
  <ClientOnly>
    <ClientProfile @logout="onLogout" />
    
    <template #fallback>
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Chargement des informations...
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Veuillez patienter
            </p>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// Définir cette page comme publique (pas besoin de middleware)
// Le composant ClientProfile gèrera lui-même la redirection si nécessaire
definePageMeta({
  middleware: [],
  layout: 'default'
})

const router = useRouter()

const onLogout = () => {
  console.log('Déconnexion réussie')
}
</script> 