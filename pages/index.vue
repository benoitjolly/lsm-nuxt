<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Bienvenue sur LSM App
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Votre application de gestion de serrures intelligentes
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5">
        <p class="text-sm text-gray-600">
          Utilisez le menu latéral pour naviguer entre les différentes fonctionnalités de l'application.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Carte Serrures -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-md bg-indigo-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Gestion des serrures
            </h3>
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Accédez à vos serrures connectées et gérez leurs paramètres.
            </p>
            <div class="mt-5">
              <NuxtLink to="/serrure" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Voir mes serrures
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Carte Profil -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-md bg-indigo-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Mon profil
            </h3>
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Consultez et modifiez vos informations personnelles.
            </p>
            <div class="mt-5">
              <NuxtLink to="/profile" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Voir mon profil
              </NuxtLink>
            </div>
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
