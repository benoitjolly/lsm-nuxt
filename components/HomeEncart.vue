<template>
  <div class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-4">
    <div class="flex flex-col lg:flex-row items-center justify-between">
      <!-- Contenu principal -->
      <div class="flex-1 mb-4 lg:mb-0 lg:mr-6">
        <h2 class="text-xl font-bold text-h2 mb-2">
          {{ title }}
        </h2>
        <p class="text-indigo-700 mb-4">
          {{ description }}
        </p>
        
        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink 
            v-if="primaryAction"
            :to="primaryAction.link" 
            class="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            {{ primaryAction.text }}
            <svg v-if="primaryAction.icon" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
          
          <button 
            v-if="secondaryAction"
            @click="secondaryAction.onClick"
            class="inline-flex items-center justify-center px-4 py-2 border border-indigo-300 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            {{ secondaryAction.text }}
          </button>
        </div>
      </div>
      
      <!-- Image ou icône -->
      <div class="flex-shrink-0">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg v-if="icon" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
          </svg>
          <img v-else-if="image" :src="image" :alt="title" class="w-8 h-8 object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Action {
  text: string
  link?: string
  onClick?: () => void
  icon?: boolean
}

interface Props {
  title: string
  description: string
  primaryAction?: Action
  secondaryAction?: Action
  icon?: string
  image?: string
}

defineProps<Props>()
</script>
