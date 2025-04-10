<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-white shadow-md fixed rounded-xl z-10
                sm:w-20 sm:min-h-[calc(100%-40px)] sm:my-4 sm:mx-4 sm:flex-col
                w-full h-20 top-0 left-0 flex flex-row items-center justify-between px-4 py-2">
      <div class="sm:mb-8 sm:mt-0 mt-0">
        <NuxtLink to="/" class="block p-2 rounded-lg border border-gray-200">
          <div class="w-10 h-6 flex items-center justify-center">
            <span class="text-gray-900 font-bold text-1xl p-2">LSM</span>
          </div>
        </NuxtLink>
      </div>
      
      <div class="flex sm:flex-col sm:space-y-4 flex-row space-x-4 sm:space-x-0">
        <NuxtLink to="/" class="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center w-9 h-9" :class="{ 'bg-gray-200': $route.path === '/' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-600">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </NuxtLink>
        
        <NuxtLink v-if="isModerator" to="/serrure" class="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center w-9 h-9" :class="{ 'bg-gray-200': $route.path === '/serrure' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-600">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>
      
      <div class="sm:mt-auto">
        <NuxtLink to="/profile" class="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center w-9 h-9" :class="{ 'bg-gray-200': $route.path === '/profile' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-600">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
        
        <!-- Lien vers l'administration des utilisateurs - visible uniquement pour les administrateurs -->
        <NuxtLink 
          v-if="isAdmin" 
          to="/admin/users" 
          class="mt-2 p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center w-9 h-9" 
          :class="{ 'bg-gray-200': $route.path === '/admin/users' }"
          title="Administration des utilisateurs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-indigo-600">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <div class="pt-24 sm:pt-0 sm:ml-24">
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'

const router = useRouter()
const { logout, isLoggedIn, isAdmin, isModerator } = useAuth()

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    router.push('/login')
  }
}
</script> 