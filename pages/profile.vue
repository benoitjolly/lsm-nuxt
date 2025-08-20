<template>
  <ClientOnly>
    <ClientProfile @logout="onLogout" />
    
    <template #fallback>
      <div>
        <Heading level="1" class="mb-6">Mon Profil</Heading>
        <Card class="mb-6">
          <template #header>
            <Heading level="3">
              Chargement des informations...
            </Heading>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Veuillez patienter
            </p>
          </template>
        </Card>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, Heading } from '~/design-system/components'

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