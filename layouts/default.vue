<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Barre de navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-indigo-600">LSM App</NuxtLink>
            </div>
          </div>
          <div class="flex items-center" v-if="isLoggedIn">
            <button 
              @click="handleLogout" 
              class="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'

const router = useRouter()
const { logout, isLoggedIn } = useAuth()

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    router.push('/login')
  }
}
</script> 