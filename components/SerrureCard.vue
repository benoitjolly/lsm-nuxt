<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center">
        <div class="p-2 bg-indigo-100 rounded-md mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-gray-900">{{ serrure.codeArticle }}</h4>
          <p class="text-sm text-gray-500">{{ serrure.designation || 'Sans désignation' }}</p>
        </div>
      </div>
      <div>
        <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          {{ serrure.typeDeCle }}
        </span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div v-if="serrure.photoUrl" class="col-span-1 md:col-span-2">
        <img 
          :src="serrure.photoUrl" 
          alt="Photo de la serrure" 
          class="h-48 w-full object-cover rounded-md"
        />
      </div>
      
      <div>
        <h5 class="text-sm font-medium text-gray-500">Longueur du Corps</h5>
        <p>{{ serrure.longueurDuCorpsMm }} mm</p>
      </div>
      
      <div>
        <h5 class="text-sm font-medium text-gray-500">Course</h5>
        <p>{{ serrure.course }}</p>
      </div>
      
      <div>
        <h5 class="text-sm font-medium text-gray-500">Sens</h5>
        <p>{{ serrure.sens }}</p>
      </div>
      
      <div>
        <h5 class="text-sm font-medium text-gray-500">Type de Came</h5>
        <p>{{ serrure.typeDeCame }}</p>
      </div>
      
      <div v-if="serrure.sortieDeCle">
        <h5 class="text-sm font-medium text-gray-500">Sortie de Clé</h5>
        <p>{{ serrure.sortieDeCle }}</p>
      </div>
      
      <div v-if="serrure.fixationSerrure">
        <h5 class="text-sm font-medium text-gray-500">Fixation Serrure</h5>
        <p>{{ serrure.fixationSerrure }}</p>
      </div>
      
      <div v-if="serrure.pgPossible">
        <h5 class="text-sm font-medium text-gray-500">PG Possible</h5>
        <p>{{ serrure.pgPossible }}</p>
      </div>
    </div>
    
    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-2">
      <NuxtLink 
        :to="`/serrure/${serrure.id}`" 
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Détails
      </NuxtLink>
      
      <button 
        @click="$emit('edit', serrure)" 
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Modifier
      </button>
      <button 
        @click="$emit('delete', serrure.id)" 
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Serrure } from '~/types/serrure'

defineProps<{
  serrure: Serrure
}>()

defineEmits<{
  (e: 'edit', serrure: Serrure): void
  (e: 'delete', id?: string): void
}>()
</script> 