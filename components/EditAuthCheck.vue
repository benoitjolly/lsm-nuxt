<template>
  <ClientOnly>
    <div v-if="showEditForm">
      <slot></slot>
    </div>
    <div v-else-if="!isLoggedIn" class="bg-yellow-50 p-4 rounded-md my-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Connexion requise</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>Vous devez être connecté pour accéder à cette fonctionnalité.</p>
            <p class="mt-2">
              <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-900">Se connecter</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="bg-red-50 p-4 rounded-md my-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Accès non autorisé</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>Vous n'avez pas les droits nécessaires pour modifier cette ressource.</p>
          </div>
        </div>
      </div>
    </div>
    
    <template #fallback>
      <div class="bg-gray-50 p-4 rounded-md my-4">
        <p class="text-gray-600">Vérification des autorisations...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useAuth from '~/composables/useAuth'

const props = defineProps({
  // Si l'on veut vérifier si l'utilisateur est modérateur ou admin
  requireModerator: {
    type: Boolean,
    default: true
  },
  
  // Si l'on veut vérifier si l'utilisateur est uniquement admin
  requireAdmin: {
    type: Boolean,
    default: false
  }
})

const { isLoggedIn, isAdmin, isModerator } = useAuth()

// Déterminer si l'utilisateur a le droit d'éditer
const showEditForm = computed(() => {
  if (!isLoggedIn.value) return false
  
  if (props.requireAdmin) {
    return isAdmin.value
  }
  
  if (props.requireModerator) {
    return isModerator.value
  }
  
  return true
})
</script> 