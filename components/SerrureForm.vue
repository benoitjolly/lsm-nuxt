<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      {{ serrure.id ? 'Modifier la serrure' : 'Ajouter une nouvelle serrure' }}
    </h2>
    
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Code Article -->
        <div>
          <label for="codeArticle" class="block text-sm font-medium text-gray-700">Code Article</label>
          <input 
            type="text" 
            id="codeArticle" 
            v-model="serrure.codeArticle" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <!-- Type de Clé -->
        <div>
          <label for="typeDeCle" class="block text-sm font-medium text-gray-700">Type de Clé</label>
          <select 
            id="typeDeCle" 
            v-model="serrure.typeDeCle" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="sans clé">Sans clé</option>
            <option value="clé identique">Clé identique</option>
            <option value="cle varis">Clé varis</option>
          </select>
        </div>
        
        <!-- Désignation -->
        <div>
          <label for="designation" class="block text-sm font-medium text-gray-700">Désignation</label>
          <input 
            type="text" 
            id="designation" 
            v-model="serrure.designation" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <!-- Longueur du Corps -->
        <div>
          <label for="longueurDuCorpsMm" class="block text-sm font-medium text-gray-700">Longueur du Corps (mm)</label>
          <input 
            type="number" 
            id="longueurDuCorpsMm" 
            v-model="serrure.longueurDuCorpsMm" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <!-- Course -->
        <div>
          <label for="course" class="block text-sm font-medium text-gray-700">Course</label>
          <input 
            type="text" 
            id="course" 
            v-model="serrure.course" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <!-- Sens -->
        <div>
          <label for="sens" class="block text-sm font-medium text-gray-700">Sens</label>
          <select 
            id="sens" 
            v-model="serrure.sens" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Sélectionner un sens</option>
            <option value="DouG">DouG</option>
            <option value="GouD">GouD</option>
          </select>
        </div>
        
        <!-- Sortie de Clé -->
        <div>
          <label for="sortieDeCle" class="block text-sm font-medium text-gray-700">Sortie de Clé</label>
          <input 
            type="text" 
            id="sortieDeCle" 
            v-model="serrure.sortieDeCle" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <!-- Fixation Serrure -->
        <div>
          <label for="fixationSerrure" class="block text-sm font-medium text-gray-700">Fixation Serrure</label>
          <input 
            type="text" 
            id="fixationSerrure" 
            v-model="serrure.fixationSerrure" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <!-- PG Possible -->
        <div>
          <label for="pgPossible" class="block text-sm font-medium text-gray-700">PG Possible</label>
          <input 
            type="text" 
            id="pgPossible" 
            v-model="serrure.pgPossible" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <!-- Type de Came -->
        <div>
          <label for="typeDeCame" class="block text-sm font-medium text-gray-700">Type de Came</label>
          <input 
            type="text" 
            id="typeDeCame" 
            v-model="serrure.typeDeCame" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <!-- Photo -->
        <div class="col-span-1 md:col-span-2">
          <label for="photo" class="block text-sm font-medium text-gray-700">Photo</label>
          <div class="mt-1 flex items-center">
            <div v-if="photoPreview || serrure.photoUrl" class="mr-4">
              <img 
                :src="photoPreview || serrure.photoUrl" 
                alt="Aperçu de la photo" 
                class="h-32 w-32 object-cover rounded-md"
              />
            </div>
            <input 
              type="file" 
              id="photo" 
              ref="photoInput"
              @change="handlePhotoChange" 
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <span v-if="loading">Traitement en cours...</span>
          <span v-else>{{ serrure.id ? 'Mettre à jour' : 'Ajouter' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { Serrure } from '~/types/serrure'

const props = defineProps<{
  initialSerrure?: Partial<Serrure>
}>()

const emit = defineEmits<{
  (e: 'submit', serrure: Serrure, photoFile?: File): void
  (e: 'cancel'): void
}>()

// État local
const serrure = reactive<Serrure>({
  codeArticle: '',
  typeDeCle: '',
  designation: '',
  longueurDuCorpsMm: 0,
  course: '',
  sens: '',
  sortieDeCle: '',
  fixationSerrure: '',
  pgPossible: '',
  typeDeCame: '',
  photoUrl: '',
  ...props.initialSerrure
})

const photoInput = ref<HTMLInputElement | null>(null)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const loading = ref(false)

// Initialiser le formulaire avec les données existantes
onMounted(() => {
  if (props.initialSerrure) {
    Object.assign(serrure, props.initialSerrure)
  }
})

// Mettre à jour le formulaire si les props changent
watch(() => props.initialSerrure, (newVal) => {
  if (newVal) {
    Object.assign(serrure, newVal)
  }
}, { deep: true })

// Gérer le changement de photo
const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0]
    
    // Créer un aperçu de l'image
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

// Soumettre le formulaire
const submitForm = () => {
  loading.value = true
  emit('submit', serrure as Serrure, photoFile.value || undefined)
}
</script> 