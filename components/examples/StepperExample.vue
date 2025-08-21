<template>
  <div class="space-y-8 p-6">
    <h2 class="text-2xl font-bold text-gray-900">Exemples de Stepper</h2>
    
    <!-- Exemple basique -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper basique</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="basicSteps" />
      </div>
    </div>
    
    <!-- Exemple sans descriptions -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper sans descriptions</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="basicSteps" :show-descriptions="false" />
      </div>
    </div>
    
    <!-- Exemple taille petite -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper petit</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="basicSteps" size="sm" />
      </div>
    </div>
    
    <!-- Exemple taille grande -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper grand</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="basicSteps" size="lg" />
      </div>
    </div>
    
    <!-- Exemple variante minimale -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper minimal</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="basicSteps" variant="minimal" />
      </div>
    </div>
    
    <!-- Exemple interactif -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper interactif</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="interactiveSteps" />
        <div class="mt-6 flex space-x-4">
          <button 
            @click="previousStep" 
            :disabled="currentStep <= 1"
            class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button 
            @click="nextStep" 
            :disabled="currentStep >= 4"
            class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
    
    <!-- Exemple avec beaucoup d'étapes -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Stepper avec 6 étapes</h3>
      <div class="bg-white p-6 rounded-lg border">
        <StepperProgress :steps="manySteps" size="sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StepperProgress from '../StepperProgress.vue'

// État pour l'exemple interactif
const currentStep = ref(2)

// Étapes de base
const basicSteps = [
  {
    id: 1,
    title: 'Informations',
    description: 'Saisissez vos informations',
    completed: true,
    current: false
  },
  {
    id: 2,
    title: 'Validation',
    description: 'Validez vos données',
    completed: false,
    current: true
  },
  {
    id: 3,
    title: 'Confirmation',
    description: 'Confirmez votre choix',
    completed: false,
    current: false
  }
]

// Étapes interactives
const interactiveSteps = computed(() => [
  {
    id: 1,
    title: 'Début',
    description: 'Commencer le processus',
    completed: currentStep.value > 1,
    current: currentStep.value === 1
  },
  {
    id: 2,
    title: 'Progression',
    description: 'En cours de traitement',
    completed: currentStep.value > 2,
    current: currentStep.value === 2
  },
  {
    id: 3,
    title: 'Révision',
    description: 'Réviser les informations',
    completed: currentStep.value > 3,
    current: currentStep.value === 3
  },
  {
    id: 4,
    title: 'Finalisation',
    description: 'Terminer le processus',
    completed: currentStep.value > 4,
    current: currentStep.value === 4
  }
])

// Beaucoup d'étapes
const manySteps = [
  { id: 1, title: 'Étape 1', description: 'Première étape', completed: true, current: false },
  { id: 2, title: 'Étape 2', description: 'Deuxième étape', completed: true, current: false },
  { id: 3, title: 'Étape 3', description: 'Troisième étape', completed: false, current: true },
  { id: 4, title: 'Étape 4', description: 'Quatrième étape', completed: false, current: false },
  { id: 5, title: 'Étape 5', description: 'Cinquième étape', completed: false, current: false },
  { id: 6, title: 'Étape 6', description: 'Sixième étape', completed: false, current: false }
]

// Fonctions de navigation
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>
