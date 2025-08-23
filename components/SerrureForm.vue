<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      {{ serrure.id ? 'Modifier la serrure' : 'Ajouter une nouvelle serrure' }}
    </h2>
    
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="codeArticle" class="block text-sm font-medium text-gray-700">Code Article</label>
          <textarea 
            id="codeArticle" 
            v-model="serrure.codeArticle" 
            rows="3"
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300 resize-vertical"
            placeholder="Entrez le code article (les sauts de ligne sont pris en compte)"
          ></textarea>
        </div>
        
        <div>
          <label for="typeSerrure" class="block text-sm font-medium text-gray-700">Type de Serrure</label>
          <select 
            id="typeSerrure" 
            v-model="serrure.typeSerrureId" 
            @change="handleTypeChange"
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
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
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
          />
        </div>
        
        <div>
          <label for="longueurDuCorpsMm" class="block text-sm font-medium text-gray-700">Longueur du Corps (mm)</label>
          <input 
            type="number" 
            id="longueurDuCorpsMm" 
            v-model="serrure.longueurDuCorpsMm" 
            step="0.1"
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
            placeholder="Ex: 50.5"
          />
        </div>
        
        <div>
          <label for="diametre" class="block text-sm font-medium text-gray-700">Diamètre (mm)</label>
          <input 
            type="number" 
            id="diametre" 
            v-model="serrure.diametre" 
            step="0.1"
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
            placeholder="Ex: 25.5"
          />
        </div>
        
        <div>
          <label for="fixationSerrure" class="block text-sm font-medium text-gray-700">Fixation Serrure</label>
          <input 
            type="text" 
            id="fixationSerrure" 
            v-model="serrure.fixationSerrure" 
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
          />
        </div>
        
        <div>
          <label for="typeDeCame" class="block text-sm font-medium text-gray-700">Type de Came</label>
          <input 
            type="text" 
            id="typeDeCame" 
            v-model="serrure.typeDeCame" 
            class="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-300"
          />
        </div>
        
        <div class="col-span-1 md:col-span-2">
          <label for="photo" class="block text-sm font-medium text-gray-700">Photo</label>
          <div class="mt-1 flex items-center">
            <div v-if="photoPreview || serrure.photoUrl" class="mr-4">
              <img 
                :src="photoPreview || serrure.photoUrl" 
                alt="Aperçu de la photo" 
                class="h-32 w-32 object-contain rounded-md bg-gray-50"
              />
            </div>
            <input 
              type="file" 
              id="photo" 
              ref="photoInput"
              @change="handlePhotoChange" 
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 ease-in-out cursor-pointer p-2 border border-dashed border-gray-300 rounded-md hover:border-indigo-300"
            />
          </div>
        </div>
        
        <div class="col-span-1 md:col-span-2">
          <label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
          <div class="mt-1 flex items-center">
            <div v-if="planPreview || serrure.planUrl" class="mr-4">
              <img 
                v-if="!isPlanPdf" 
                :src="planPreview || serrure.planUrl" 
                alt="Aperçu du plan" 
                class="h-32 w-32 object-contain rounded-md bg-gray-50"
                @error="handlePlanImageError"
              />
              <div v-else class="h-32 w-32 bg-gray-100 rounded-md flex flex-col items-center justify-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-indigo-600 mb-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="text-xs text-gray-600 text-center">Fichier PDF</span>
                <a 
                  v-if="serrure.planUrl && !planPreview" 
                  :href="serrure.planUrl" 
                  target="_blank"
                  class="text-xs text-indigo-600 hover:underline mt-1"
                >
                  Voir le PDF
                </a>
              </div>
            </div>
            <input 
              type="file" 
              id="plan" 
              ref="planInput"
              @change="handlePlanChange" 
              accept="image/*,.pdf,application/pdf"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 ease-in-out cursor-pointer p-2 border border-dashed border-gray-300 rounded-md hover:border-indigo-300"
            />
          </div>
          
          <!-- Aperçu du plan en iframe -->
          <div v-if="isPlanPdf && (planPreview || serrure.planUrl)" class="mt-4 border border-gray-200 rounded-md">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-t-md">
              <h4 class="text-sm font-medium text-gray-700">Aperçu du plan</h4>
              <a 
                :href="planPreview || serrure.planUrl" 
                target="_blank"
                class="text-xs text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                Ouvrir dans un nouvel onglet
              </a>
            </div>
            <div class="h-48 bg-gray-100 flex items-center justify-center">
              <iframe 
                v-if="planPreview || serrure.planUrl" 
                :src="planPreview || serrure.planUrl" 
                class="w-full h-full border-0" 
                allowfullscreen
              ></iframe>
              <div v-else class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-indigo-600 mx-auto mb-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p class="text-sm text-gray-700 font-medium">Document PDF</p>
                <p class="text-xs text-gray-500 mt-1">Chargement de l'aperçu...</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-span-1 md:col-span-2">
          <label for="autreFile" class="block text-sm font-medium text-gray-700">Autre fichier</label>
          <div class="mt-1 flex items-center">
            <div v-if="autreFilePreview || serrure.autreFileUrl" class="mr-4">
              <img 
                v-if="!isAutreFilePdf" 
                :src="autreFilePreview || serrure.autreFileUrl" 
                alt="Aperçu du fichier" 
                class="h-32 w-32 object-contain rounded-md bg-gray-50"
                @error="handleAutreFileImageError"
              />
              <div v-else class="h-32 w-32 bg-gray-100 rounded-md flex flex-col items-center justify-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-green-600 mb-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="text-xs text-gray-600 text-center">Fichier PDF</span>
                <a 
                  v-if="serrure.autreFileUrl && !autreFilePreview" 
                  :href="serrure.autreFileUrl" 
                  target="_blank"
                  class="text-xs text-green-600 hover:underline mt-1"
                >
                  Voir le PDF
                </a>
              </div>
            </div>
            <input 
              type="file" 
              id="autreFile" 
              ref="autreFileInput"
              @change="handleAutreFileChange" 
              accept="image/*,.pdf,application/pdf"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition duration-150 ease-in-out cursor-pointer p-2 border border-dashed border-gray-300 rounded-md hover:border-green-300"
            />
          </div>
          
          <!-- Aperçu du fichier en iframe -->
          <div v-if="isAutreFilePdf && (autreFilePreview || serrure.autreFileUrl)" class="mt-4 border border-gray-200 rounded-md">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-t-md">
              <h4 class="text-sm font-medium text-gray-700">Aperçu du fichier</h4>
              <a 
                :href="autreFilePreview || serrure.autreFileUrl" 
                target="_blank"
                class="text-xs text-green-600 hover:text-green-800 focus:outline-none"
              >
                Ouvrir dans un nouvel onglet
              </a>
            </div>
            <div class="h-48 bg-gray-100 flex items-center justify-center">
              <iframe 
                v-if="autreFilePreview || serrure.autreFileUrl" 
                :src="autreFilePreview || serrure.autreFileUrl" 
                class="w-full h-full border-0" 
                allowfullscreen
              ></iframe>
              <div v-else class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-green-600 mx-auto mb-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p class="text-sm text-gray-700 font-medium">Document PDF</p>
                <p class="text-xs text-gray-500 mt-1">Chargement de l'aperçu...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="inline-flex justify-center py-3 px-5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          class="inline-flex justify-center py-3 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
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
import useAuth from '~/composables/useAuth'

const props = defineProps<{
  initialSerrure?: Partial<Serrure>
}>()

const emit = defineEmits<{
  (e: 'submit', serrure: Serrure, photoFile?: File, planFile?: File, autreFile?: File): void
  (e: 'cancel'): void
  (e: 'unauthorized'): void
}>()

const serrure = reactive<Serrure>({
  codeArticle: '',
  designation: '',
  typeSerrureId: '',
  typeSerrureNom: '',
  longueurDuCorpsMm: 0,
  diametre: 0,
  fixationSerrure: '',
  typeDeCame: '',
  photoUrl: '',
  planUrl: '',
  autreFileUrl: '',
  ...props.initialSerrure
})

const photoInput = ref<HTMLInputElement | null>(null)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const planInput = ref<HTMLInputElement | null>(null)
const planFile = ref<File | null>(null)
const planPreview = ref<string | null>(null)
const isPlanPdf = ref(false)
const autreFileInput = ref<HTMLInputElement | null>(null)
const autreFileFile = ref<File | null>(null)
const autreFilePreview = ref<string | null>(null)
const isAutreFilePdf = ref(false)
const loading = ref(false)
const typesSerrure = ref<TypeSerrure[]>([])

const typeSerrureService = useTypeSerrureService()
const { isModerator } = useAuth()

onMounted(async () => {
  if (props.initialSerrure) {
    Object.assign(serrure, props.initialSerrure)
    
    // Vérifier si le plan existant est un PDF
    if (serrure.planUrl) {
      isPlanPdf.value = serrure.planUrl.toLowerCase().endsWith('.pdf')
    }
    
    // Vérifier si l'autre fichier existant est un PDF
    if (serrure.autreFileUrl) {
      isAutreFilePdf.value = serrure.autreFileUrl.toLowerCase().endsWith('.pdf')
    }
  }
  
  // Charger les types de serrures
  try {
    typesSerrure.value = await typeSerrureService.getAllTypesSerrures()
  } catch (err) {
    console.error('Erreur lors du chargement des types de serrures:', err)
  }
  
  // Vérifier si l'utilisateur est modérateur ou admin
  if (!isModerator.value) {
    emit('unauthorized')
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
    const file = input.files[0]
    planFile.value = file
    
    // Vérifier si le fichier est un PDF par type MIME ou extension
    isPlanPdf.value = file.type === 'application/pdf' || 
                      file.name.toLowerCase().endsWith('.pdf')
    
    // Lecture du fichier, quelle que soit son type
    const reader = new FileReader()
    reader.onload = (e) => {
      planPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
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
  // Vérifier si l'utilisateur est modérateur ou admin
  if (!isModerator.value) {
    emit('unauthorized')
    return
  }
  
  loading.value = true
  emit('submit', serrure as Serrure, photoFile.value || undefined, planFile.value || undefined, autreFileFile.value || undefined)
}

const updateTypesSerrure = async () => {
  try {
    typesSerrure.value = await typeSerrureService.getAllTypesSerrures()
  } catch (err) {
    console.error('Erreur lors du chargement des types de serrures:', err)
  }
}

// Fonction pour gérer l'erreur de chargement de l'image du plan
const handlePlanImageError = () => {
  console.log('Erreur de chargement de l\'image, probablement un PDF')
  isPlanPdf.value = true
}

const handleAutreFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    autreFileFile.value = file
    
    // Vérifier si le fichier est un PDF par type MIME ou extension
    isAutreFilePdf.value = file.type === 'application/pdf' || 
                          file.name.toLowerCase().endsWith('.pdf')
    
    // Lecture du fichier, quelle que soit son type
    const reader = new FileReader()
    reader.onload = (e) => {
      autreFilePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Fonction pour gérer l'erreur de chargement de l'image de l'autre fichier
const handleAutreFileImageError = () => {
  console.log('Erreur de chargement de l\'image, probablement un PDF')
  isAutreFilePdf.value = true
}

defineExpose({
  updateTypesSerrure
})
</script> 