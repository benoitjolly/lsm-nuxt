<template>
  <footer class="bg-surface-primary rounded-xl shadow-md">
    <div class="py-6 px-4 sm:px-6 lg:px-8 items-center justify-center">
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <!-- Logos externes -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-0">
          <div class="flex flex-wrap justify-center items-center gap-2 mb-3 sm:mb-0 sm:mr-3">
            <img src="~/assets/images/logos-ext/logo1.png" alt="Logo externe 1" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo2.png" alt="Logo externe 2" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo3.png" alt="Logo externe 3" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo4.png" alt="Logo externe 4" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo5.png" alt="Logo externe 5" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo6.png" alt="Logo externe 6" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo7.png" alt="Logo externe 7" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo8.png" alt="Logo externe 8" class="h-8 w-auto rounded-lg object-contain" />
            <img src="~/assets/images/logos-ext/logo9.png" alt="Logo externe 9" class="h-8 w-auto rounded-lg object-contain" />
          </div>
        </div>
      </div>
      
      <!-- Séparateur -->
      <div class="border-t border-primary my-4"></div>
      
      <!-- Section LSM et copyright -->
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <!-- LSM et description -->
        <div class="flex items-center mb-4 sm:mb-0">
          <div>
            <h3 class="text-label-base text-primary">LSM</h3>
            <p class="text-caption text-secondary">Système de gestion des serrures</p>
          </div>
        </div>
        
        <!-- Copyright -->
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