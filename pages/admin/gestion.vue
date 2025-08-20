<template>
  <div>
    <Heading level="1" class="mb-6">Gestion des Produits</Heading>
    
    <Card>
      <Tabs v-model="activeTab" :tabs="tabs">
        <template #default="{ activeTab }">
          <div v-if="activeTab === 'serrures'">
            <SerruresManagement />
          </div>
          <div v-if="activeTab === 'categories'">
            <CategoriesManagement />
          </div>
        </template>
      </Tabs>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Heading, Card, Tabs } from '~/design-system/components'
import SerruresManagement from '~/components/admin/SerruresManagement.vue'
import CategoriesManagement from '~/components/admin/CategoriesManagement.vue'

// Définir le middleware d'administration
definePageMeta({
  middleware: ['admin']
})

const activeTab = ref('serrures')

const tabs = [
  { id: 'serrures', label: 'Serrures' },
  { id: 'categories', label: 'Catégories' }
]
</script> 