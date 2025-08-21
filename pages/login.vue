<template>
  <ClientOnly>
    <ClientLogin @login-success="onLoginSuccess" />
    
    <template #fallback>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
              Connexion
            </h2>
            <p class="mt-4 text-center text-gray-600">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

// Définir cette page comme publique (pas besoin de middleware)
definePageMeta({
  middleware: [],
  layout: 'auth'
})

const router = useRouter()

const route = useRoute()

const onLoginSuccess = () => {
  // Récupérer l'URL de redirection depuis les paramètres de requête
  const redirectTo = route.query.redirect as string
  
  if (redirectTo) {
    // Rediriger vers la page demandée
    router.push(redirectTo)
  } else {
    // Vérifier s'il y a une page précédente dans l'historique
    if (typeof window !== 'undefined' && window.history.length > 1) {
      // Retourner à la page précédente
      router.back()
    } else {
      // Redirection par défaut vers la page d'accueil si pas d'historique
      router.push('/')
    }
  }
}
</script> 