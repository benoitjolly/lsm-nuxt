<template>
  <div class="tableau-serrures bg-surface-primary rounded-xl elevation-card">
    <!-- En-tête avec recherche et bouton d'ajout -->
    <div class="header-section border-b border-primary">
      <div class="header-info">
        <h3 class="text-heading-xl text-primary">{{ title }}</h3>
        <p class="text-body-base text-secondary">{{ description }}</p>
      </div>
      
      <div class="header-actions">
        <!-- Recherche -->
        <SearchInput 
          v-model="searchQuery" 
          placeholder="Rechercher dans toutes les colonnes..."
          class="search-input"
        />
        
        <!-- Bouton d'ajout -->
        <Button 
          v-if="showAddButton && canEdit"
          @click="$emit('add-serrure')"
          variant="primary"
          size="sm"
          class="add-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="add-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="button-text">Ajouter une serrure</span>
        </Button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-section p-md text-center">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Table -->
    <div v-else class="table-section">
      <div v-if="filteredSerrures.length === 0" class="empty-state p-md text-center text-secondary">
        Aucune serrure trouvée. {{ canEdit ? 'Ajoutez-en une nouvelle !' : '' }}
      </div>
      
      <div v-else class="table-container" ref="tableContainer" @scroll="handleScroll">
        <table class="table">
          <thead class="table-header bg-surface-secondary">
            <tr>
              <th :class="['col-photo', 'sticky-photo-header', { 'show-shadow': canScrollRight }]">Photo</th>
              <th class="col-plan hidden-mobile">Plan</th>
              <th class="col-code">Code Article</th>
              <th class="col-designation hidden-mobile">Désignation</th>
              <th class="col-type-cle hidden-small">Type de Clé</th>
              <th class="col-longueur hidden-large">Longueur</th>
              <th class="col-diametre hidden-large">Diamètre</th>
              <th class="col-course hidden-large">Course</th>
              <th class="col-sens hidden-xlarge">Sens</th>
              <th class="col-type-came hidden-xlarge">Type de Came</th>
              <th class="col-type-serrure hidden-xlarge">Type de Serrure</th>
              <th v-if="canEdit" class="col-actions">
                <span class="sr-only">Actions</span>
              </th>
              <th v-if="canEdit" :class="['col-edit', 'sticky-actions-header', { 'show-shadow': canScrollLeft }]">
                <span class="sr-only">Modifier</span>
              </th>
            </tr>
          </thead>
          
          <tbody class="table-body">
            <tr v-for="serrure in filteredSerrures" :key="serrure.id" class="table-row">
              <!-- Photo -->
              <td :class="['cell-photo', 'sticky-photo-cell', { 'show-shadow': canScrollRight }]">
                <div v-if="serrure.photoUrl" class="photo-container">
                  <img 
                    :src="serrure.photoUrl" 
                    alt="Photo de la serrure" 
                    class="photo-image"
                  />
                </div>
                <div v-else class="photo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="photo-icon">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                  </svg>
                </div>
              </td>
              
              <!-- Plan -->
              <td class="cell-plan hidden-mobile">
                <div v-if="serrure.planUrl" class="plan-container">
                  <img 
                    :src="serrure.planUrl" 
                    v-if="!imageLoadErrors[serrure.id?.toString() || '']"
                    alt="Plan de la serrure" 
                    class="plan-image"
                    @error="handleImageError($event, serrure.id?.toString() || '')"
                  />
                  <iframe
                    v-else
                    :src="serrure.planUrl"
                    class="plan-iframe"
                    allowfullscreen
                  ></iframe>
                  <button 
                    v-if="serrure.planUrl"
                    @click.stop="openPlan(serrure.planUrl)"
                    class="plan-overlay"
                    title="Voir le plan"
                  >
                    Voir
                  </button>
                </div>
                <div v-else class="plan-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="plan-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
              </td>
              
              <!-- Code Article -->
              <td class="cell-code">
                <div class="text-label-base text-primary whitespace-pre-line">{{ serrure.codeArticle }}</div>
              </td>
              
              <!-- Désignation -->
              <td class="cell-designation hidden-mobile">
                <div class="text-body-small text-secondary">{{ serrure.designation || 'Sans désignation' }}</div>
              </td>
              
              <!-- Type de Clé -->
              <td class="cell-type-cle hidden-small">
                <Badge variant="primary">{{ serrure.typeDeCle }}</Badge>
              </td>
              
              <!-- Longueur -->
              <td class="cell-longueur hidden-large">
                <span class="text-body-small text-secondary">{{ serrure.longueurDuCorpsMm }} mm</span>
              </td>
              
              <!-- Diamètre -->
              <td class="cell-diametre hidden-large">
                <span class="text-body-small text-secondary">{{ serrure.diametre ? `${serrure.diametre} mm` : '-' }}</span>
              </td>
              
              <!-- Course -->
              <td class="cell-course hidden-large">
                <span class="text-body-small text-secondary">{{ serrure.course }}</span>
              </td>
              
              <!-- Sens -->
              <td class="cell-sens hidden-xlarge">
                <span class="text-body-small text-secondary">{{ serrure.sens }}</span>
              </td>
              
              <!-- Type de Came -->
              <td class="cell-type-came hidden-xlarge">
                <span class="text-body-small text-secondary">{{ serrure.typeDeCame }}</span>
              </td>
              
              <!-- Type de Serrure -->
              <td class="cell-type-serrure hidden-xlarge">
                <span class="text-body-small text-secondary">{{ serrure.typeSerrureNom }}</span>
              </td>
              
              <!-- Actions -->
              <td v-if="canEdit" class="cell-actions">
                <div class="actions-container">
                  <Button
                    v-if="showViewButton"
                    @click="$emit('view-serrure', serrure)"
                    variant="secondary"
                    size="sm"
                    title="Détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="action-text">Détails</span>
                  </Button>
                  
                  <Button
                    @click="serrure.id && $emit('delete-serrure', serrure.id)"
                    variant="danger"
                    size="sm"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </td>
              
              <!-- Bouton Modifier sticky -->
              <td v-if="canEdit" :class="['cell-edit', 'sticky-actions-cell', { 'show-shadow': canScrollLeft }]">
                <Button
                  @click="$emit('edit-serrure', serrure)"
                  variant="secondary"
                  size="sm"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="action-text">Modifier</span>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal d'affichage du plan -->
    <Modal v-model="showPlanModal" title="Plan de la serrure" size="xl" :cancel-text="''" :confirm-text="''"
    >
      <div class="plan-modal-content">
        <iframe 
          v-if="currentPlanUrl"
          :src="currentPlanUrl" 
          class="plan-modal-iframe" 
          allowfullscreen
        ></iframe>
      </div>
      
      <div class="plan-modal-actions">
        <Button @click="showPlanModal = false" variant="secondary">
          Fermer
        </Button>
        <Button @click="openPlanInNewTab" variant="primary">
          Ouvrir dans un nouvel onglet
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted, nextTick, watch } from 'vue'
import type { Serrure } from '~/types/serrure'
import { 
  Button, 
  Badge, 
  Modal 
} from '~/design-system/components'
import SearchInput from '~/design-system/components/SearchInput.vue'

// Props
interface Props {
  serrures: Serrure[]
  loading?: boolean
  canEdit?: boolean
  showAddButton?: boolean
  showViewButton?: boolean
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  canEdit: true,
  showAddButton: true,
  showViewButton: true,
  title: 'Serrures connectées',
  description: 'Gérez vos serrures intelligentes'
})

// Emits
const emit = defineEmits<{
  'add-serrure': []
  'edit-serrure': [serrure: Serrure]
  'delete-serrure': [id: string]
  'view-serrure': [serrure: Serrure]
}>()

// État local
const searchQuery = ref('')
const showPlanModal = ref(false)
const currentPlanUrl = ref<string | null>(null)
const imageLoadErrors = ref<Record<string, boolean>>({})
const tableContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Serrures filtrées par la recherche sur toutes les colonnes
const filteredSerrures = computed(() => {
  if (!searchQuery.value) return props.serrures
  
  const query = searchQuery.value.toLowerCase()
  return props.serrures.filter(serrure => {
    // Fonction helper pour vérifier si une valeur contient la requête
    const matchesQuery = (value: any) => {
      if (!value) return false
      return value.toString().toLowerCase().includes(query)
    }
    
    return (
      // Code Article
      matchesQuery(serrure.codeArticle) ||
      // Désignation
      matchesQuery(serrure.designation) ||
      // Type de Clé
      matchesQuery(serrure.typeDeCle) ||
      // Longueur (avec ou sans "mm")
      matchesQuery(serrure.longueurDuCorpsMm) ||
      matchesQuery(`${serrure.longueurDuCorpsMm} mm`) ||
      // Diamètre (avec ou sans "mm")
      matchesQuery(serrure.diametre) ||
      (serrure.diametre && matchesQuery(`${serrure.diametre} mm`)) ||
      // Course
      matchesQuery(serrure.course) ||
      // Sens
      matchesQuery(serrure.sens) ||
      // Type de Came
      matchesQuery(serrure.typeDeCame) ||
      // Type de Serrure
      matchesQuery(serrure.typeSerrureNom) ||
      // Fixation Serrure
      matchesQuery(serrure.fixationSerrure) ||
      // Sortie de Clé
      matchesQuery(serrure.sortieDeCle) ||
      // PG Possible
      matchesQuery(serrure.pgPossible)
    )
  })
})

// Gérer l'erreur de chargement d'image
const handleImageError = (event: Event, serrureId: string) => {
  imageLoadErrors.value[serrureId] = true
}

// Ouvrir la modale du plan
const openPlan = (planUrl: string) => {
  currentPlanUrl.value = planUrl
  showPlanModal.value = true
}

// Ouvrir le plan dans un nouvel onglet
const openPlanInNewTab = () => {
  if (!currentPlanUrl.value) return
  
  try {
    window.open(currentPlanUrl.value, '_blank')
    showPlanModal.value = false
  } catch (err) {
    console.error('Erreur lors de l\'ouverture du plan:', err)
  }
}

// Fonction simple pour vérifier le scroll
const updateScrollShadows = () => {
  if (!tableContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tableContainer.value
  
  // Simple : peut-on scroller dans chaque direction ?
  canScrollRight.value = scrollLeft > 5  // 5px de tolérance
  canScrollLeft.value = scrollLeft < (scrollWidth - clientWidth - 5)  // 5px de tolérance
}

// Event listener pour le scroll
const handleScroll = () => {
  updateScrollShadows()
}

onMounted(async () => {
  await nextTick()
  updateScrollShadows()
})

// Watcher simple pour les changements de données
watch([() => props.serrures, filteredSerrures], async () => {
  await nextTick()
  updateScrollShadows()
})
</script>

<style scoped>
/* Les styles de base du tableau sont appliqués via les classes CSS */

.header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* spacing-4 */
  padding: 1rem; /* spacing-4 */
  overflow-x: hidden;
}

@media (min-width: 640px) {
  .header-section {
    padding: 1.5rem; /* spacing-6 */
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.header-info {
  flex: 1;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  width: 100%;
  min-width: 0; /* Permet la compression */
}

@media (min-width: 640px) {
  .header-actions {
    flex-direction: row;
    width: auto;
    flex-shrink: 1;
  }
}

.search-input {
  min-width: 250px;
  max-width: 100%;
}

@media (min-width: 768px) {
  .search-input {
    min-width: 300px;
  }
}

.add-button .add-icon {
  width: 1rem; /* 16px */
  height: 1rem; /* 16px */
  margin-right: 0.5rem; /* spacing-2 */
}

.button-text {
  display: none;
}

@media (min-width: 640px) {
  .button-text {
    display: inline;
  }
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 3rem; /* spacing-12 */
  height: 3rem; /* spacing-12 */
  border: 2px solid #e5e7eb; /* border-gray-200 */
  border-top: 2px solid #4f46e5; /* indigo-600 */
  border-radius: 9999px; /* full */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-section {
  padding: 0;
}

.table-container {
  overflow-x: auto;
  position: relative;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header th {
  padding: 0.75rem 1rem; /* spacing-3 spacing-4 */
  text-align: left;
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  color: #6b7280; /* text-gray-500 */
  text-transform: uppercase;
  letter-spacing: 0.025em; /* tracking-wide */
  border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
}

.table-body tr {
  border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
}

.table-body td {
  padding: 0.75rem 1rem; /* spacing-3 spacing-4 */
  white-space: nowrap;
}

/* Colonnes responsives */
.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: table-cell;
  }
}

.hidden-small {
  display: none;
}

@media (min-width: 640px) {
  .hidden-small {
    display: table-cell;
  }
}

.hidden-large {
  display: none;
}

@media (min-width: 1024px) {
  .hidden-large {
    display: table-cell;
  }
}

.hidden-xlarge {
  display: none;
}

@media (min-width: 1280px) {
  .hidden-xlarge {
    display: table-cell;
  }
}

/* Styles des cellules */
.table-row:hover {
  background-color: #f9fafb; /* bg-gray-50 */
}

.cell-photo,
.cell-plan {
  padding: 0.75rem 1rem; /* spacing-3 spacing-4 */
}

.photo-container,
.plan-container {
  width: 2.5rem; /* spacing-10 */
  height: 2.5rem; /* spacing-10 */
  position: relative;
}

.photo-image,
.plan-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.375rem; /* rounded-md */
  background-color: #f9fafb; /* gray-50 */
}

.plan-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.photo-placeholder,
.plan-placeholder {
  width: 2.5rem; /* spacing-10 */
  height: 2.5rem; /* spacing-10 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem; /* rounded-md */
}

.photo-placeholder {
  background-color: #eef2ff; /* indigo-50 */
}

.plan-placeholder {
  background-color: #f3f4f6; /* gray-100 */
}

.photo-icon {
  width: 1.5rem; /* spacing-6 */
  height: 1.5rem; /* spacing-6 */
  color: #4f46e5; /* indigo-600 */
}

.plan-icon {
  width: 1.5rem; /* spacing-6 */
  height: 1.5rem; /* spacing-6 */
  color: #9ca3af; /* gray-400 */
}

.plan-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0.375rem; /* rounded-md */
  color: white;
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.plan-container:hover .plan-overlay {
  opacity: 1;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; /* spacing-2 */
}

.action-icon {
  width: 1rem; /* 16px */
  height: 1rem; /* 16px */
}

.action-text {
  display: none;
  margin-left: 0.25rem; /* spacing-1 */
}

@media (min-width: 640px) {
  .action-text {
    display: inline;
  }
}

/* Modal du plan */
.plan-modal-content {
  background-color: #f3f4f6; /* gray-100 */
  border-radius: 0.375rem; /* rounded-md */
  overflow: hidden;
  height: 70vh;
}

.plan-modal-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.plan-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem; /* spacing-3 */
}

/* Colonne Photo sticky à gauche */
.sticky-photo-header,
.sticky-photo-cell {
  position: sticky;
  left: 0;
  background-color: #f9fafb; /* bg-gray-50 pour le header */
  z-index: 10;
  border-right: 1px solid #e5e7eb; /* border-gray-200 */
  min-width: 80px;
}

.sticky-photo-cell {
  background-color: #ffffff; /* bg-white pour les cellules */
}

/* Effet d'ombre pour indiquer que c'est sticky - conditionnel */
.sticky-photo-header.show-shadow::after,
.sticky-photo-cell.show-shadow::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

/* Colonne Actions sticky à droite */
.sticky-actions-header,
.sticky-actions-cell {
  position: sticky;
  right: 0;
  background-color: #f9fafb; /* bg-gray-50 pour le header */
  z-index: 10;
  border-left: 1px solid #e5e7eb; /* border-gray-200 */
  min-width: 80px;
}

.sticky-actions-cell {
  background-color: #ffffff; /* bg-white pour les cellules */
}

/* Effet d'ombre pour indiquer que c'est sticky - conditionnel */
.sticky-actions-header.show-shadow::before,
.sticky-actions-cell.show-shadow::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

/* Colonne Modifier centrée */
.cell-edit {
  text-align: center;
}

/* Ajustements responsive */
@media (max-width: 640px) {
  .sticky-photo-header,
  .sticky-photo-cell {
    min-width: 60px;
  }
  
  .sticky-actions-header,
  .sticky-actions-cell {
    min-width: 80px;
  }
}
</style>