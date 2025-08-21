<template>
  <ClientOnly>
    <ClientCart />
    
    <template #fallback>
      <div>
        <Heading level="1" class="mb-6">Mon Panier</Heading>
        <Card class="mb-6">
          <template #header>
            <Heading level="3">
              Chargement...
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
import { Heading, Card } from '../design-system/components'

// Configuration de la page
// definePageMeta({
//   middleware: [],
//   layout: 'default'
// })

// SEO
// useSeoMeta({
//   title: 'Mon Panier - Finaliser la commande',
//   description: 'Finalisez votre commande de serrures professionnelles en 3 étapes simples.',
//   robots: 'noindex, nofollow'
// })
</script>
