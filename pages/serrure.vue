<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestion des Serrures</h1>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Vos serrures connectées
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Gérez vos serrures intelligentes
        </p>
      </div>
      <div class="border-t border-gray-200">
        <div class="px-4 py-5 sm:p-6">
          <div class="space-y-4">
            <!-- Liste des serrures (exemple) -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="p-2 bg-indigo-100 rounded-md mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Serrure Entrée Principale</h4>
                  <p class="text-sm text-gray-500">Dernière activité: Aujourd'hui, 10:45</p>
                </div>
              </div>
              <div>
                <button class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Verrouillée
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="p-2 bg-indigo-100 rounded-md mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Serrure Garage</h4>
                  <p class="text-sm text-gray-500">Dernière activité: Hier, 18:30</p>
                </div>
              </div>
              <div>
                <button class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Déverrouillée
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Ajouter une nouvelle serrure
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Définir le middleware d'authentification
definePageMeta({
  middleware: ['auth']
})
</script> 