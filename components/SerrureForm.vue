<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      {{ serrure.id ? 'Modifier la serrure' : 'Ajouter une nouvelle serrure' }}
    </h2>
    
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="codeArticle" class="block text-sm font-medium text-gray-700">Code Article</label>
          <input 
            type="text" 
            id="codeArticle" 
            v-model="serrure.codeArticle" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label for="typeSerrure" class="block text-sm font-medium text-gray-700">Type de Serrure</label>
          <select 
            id="typeSerrure" 
            v-model="serrure.typeSerrureId" 
            @change="handleTypeChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionner un type</option>
            <option v-for="type in typesSerrure" :key="type.id" :value="type.id">
              {{ type.nom }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="designation" class="block text-sm font-medium text-gray-700">Désignation</label>
          <input 
            type="text" 
            id="designation" 
            v-model="serrure.designation" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label for="longueurDuCorpsMm" class="block text-sm font-medium text-gray-700">Longueur du Corps (mm)</label>
          <input 
            type="number" 
            id="longueurDuCorpsMm" 
            v-model="serrure.longueurDuCorpsMm" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label for="fixationSerrure" class="block text-sm font-medium text-gray-700">Fixation Serrure</label>
          <input 
            type="text" 
            id="fixationSerrure" 
            v-model="serrure.fixationSerrure" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label for="typeDeCame" class="block text-sm font-medium text-gray-700">Type de Came</label>
          <input 
            type="text" 
            id="typeDeCame" 
            v-model="serrure.typeDeCame" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
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
        
        <div class="col-span-1 md:col-span-2">
          <label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
          <div class="mt-1 flex items-center">
            <div v-if="planPreview || serrure.planUrl" class="mr-4">
              <img 
                :src="planPreview || serrure.planUrl" 
                alt="Aperçu du plan" 
                class="h-32 w-32 object-cover rounded-md"
              />
            </div>
            <input 
              type="file" 
              id="plan" 
              ref="planInput"
              @change="handlePlanChange" 
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
import type { TypeSerrure } from '~/types/typeSerrure'
import { useTypeSerrureService } from '~/services/typeSerrureService'

const props = defineProps<{
  initialSerrure?: Partial<Serrure>
}>()

const emit = defineEmits<{
  (e: 'submit', serrure: Serrure, photoFile?: File, planFile?: File): void
  (e: 'cancel'): void
}>()

const serrure = reactive<Serrure>({
  codeArticle: '',
  designation: '',
  typeSerrureId: '',
  typeSerrureNom: '',
  longueurDuCorpsMm: 0,
  fixationSerrure: '',
  typeDeCame: '',
  photoUrl: '',
  planUrl: '',
  ...props.initialSerrure
})

const photoInput = ref<HTMLInputElement | null>(null)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const planInput = ref<HTMLInputElement | null>(null)
const planFile = ref<File | null>(null)
const planPreview = ref<string | null>(null)
const loading = ref(false)
const typesSerrure = ref<TypeSerrure[]>([])

const typeSerrureService = useTypeSerrureService()

onMounted(async () => {
  if (props.initialSerrure) {
    Object.assign(serrure, props.initialSerrure)
  }
  
  // Charger les types de serrures
  try {
    typesSerrure.value = await typeSerrureService.getAllTypesSerrures()
  } catch (err) {
    console.error('Erreur lors du chargement des types de serrures:', err)
  }
})

watch(() => props.initialSerrure, (newVal) => {
  if (newVal) {
    Object.assign(serrure, newVal)
  }
}, { deep: true })

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0]
    
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const handlePlanChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    planFile.value = input.files[0]
    
    const reader = new FileReader()
    reader.onload = (e) => {
      planPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const handleTypeChange = () => {
  if (serrure.typeSerrureId) {
    // Trouver le nom du type sélectionné
    const selectedType = typesSerrure.value.find(type => type.id === serrure.typeSerrureId)
    if (selectedType) {
      serrure.typeSerrureNom = selectedType.nom
    }
  } else {
    serrure.typeSerrureNom = ''
  }
}

const submitForm = () => {
  loading.value = true
  emit('submit', serrure as Serrure, photoFile.value || undefined, planFile.value || undefined)
}

const updateTypesSerrure = async () => {
  try {
    typesSerrure.value = await typeSerrureService.getAllTypesSerrures()
  } catch (err) {
    console.error('Erreur lors du chargement des types de serrures:', err)
  }
}

defineExpose({
  updateTypesSerrure
})
</script> 