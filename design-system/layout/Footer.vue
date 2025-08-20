<template>
  <footer class="bg-surface-primary rounded-xl shadow-md">
    <div class="py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <!-- Logo et nom de l'entreprise -->
        <div class="flex items-center mb-4 sm:mb-0">
          <img src="~/assets/images/logo.png" alt="LSM Logo" class="w-8 h-8 mr-3" />
          <div>
            <h3 class="text-label-base text-primary">LSM</h3>
            <p class="text-caption text-secondary">Système de gestion des serrures</p>
          </div>
        </div>
        
        <!-- Informations de copyright -->
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <p class="text-caption text-secondary">
            © {{ currentYear }} LSM. Tous droits réservés.
          </p>
        </div>
      </div>
      
      <!-- Version de l'application (visible en développement) -->
      <div v-if="isDev" class="mt-4 pt-4 border-t border-primary">
        <p class="text-caption text-tertiary text-center">
          Version de développement - {{ version }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Année courante pour le copyright
const currentYear = computed(() => new Date().getFullYear())

// Version de l'application
const version = computed(() => {
  // Peut être récupéré depuis package.json ou une variable d'environnement
  return process.env.npm_package_version || '1.0.0'
})

// Détection de l'environnement de développement
const isDev = computed(() => {
  return process.env.NODE_ENV === 'development'
})
</script> 

<style lang="css" scoped>
footer {
  margin-bottom: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>