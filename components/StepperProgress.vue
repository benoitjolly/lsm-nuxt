<template>
  <div class="stepper-container">
    <nav aria-label="Progress">
      <ol class="stepper-list">
        <li 
          v-for="(step, stepIdx) in steps" 
          :key="step.id" 
          class="stepper-item"
          :class="{ 'stepper-item--completed': step.completed }"
        >
          <!-- Contenu de l'étape -->
          <div class="stepper-step">
            <!-- Cercle avec numéro ou icône -->
            <div class="stepper-circle-container">
              <div 
                class="stepper-circle"
                :class="getCircleClass(step)"
              >
                <!-- Icône de validation pour les étapes complétées -->
                <svg 
                  v-if="step.completed" 
                  class="stepper-check-icon" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clip-rule="evenodd" 
                  />
                </svg>
                <!-- Numéro de l'étape -->
                <span v-else class="stepper-number">{{ step.id }}</span>
              </div>
            </div>
            
            <!-- Titre et description -->
            <div class="stepper-content">
              <div 
                class="stepper-title"
                :class="getTitleClass(step)"
              >
                {{ step.title }}
              </div>
              <div 
                v-if="step.description && showDescriptions"
                class="stepper-description"
              >
                {{ step.description }}
              </div>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: number | string
  title: string
  description?: string
  completed: boolean
  current: boolean
}

interface Props {
  steps: Step[]
  showDescriptions?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal'
}

withDefaults(defineProps<Props>(), {
  showDescriptions: true,
  size: 'md',
  variant: 'default'
})

// Classes dynamiques pour les différents états
const getCircleClass = (step: Step) => {
  const baseClass = 'stepper-circle'
  if (step.completed) return `${baseClass} stepper-circle--completed`
  if (step.current) return `${baseClass} stepper-circle--current`
  return `${baseClass} stepper-circle--pending`
}

const getTitleClass = (step: Step) => {
  const baseClass = 'stepper-title'
  if (step.current) return `${baseClass} stepper-title--current`
  if (step.completed) return `${baseClass} stepper-title--completed`
  return `${baseClass} stepper-title--pending`
}
</script>

<style scoped>
.stepper-container {
  width: 100%;
  padding: 1rem 0;
}

.stepper-list {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

/* Crée une ligne continue entre tous les items sauf le dernier */
.stepper-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #d1d5db; /* gray-300 par défaut */
  z-index: 0;
}

/* Ligne complétée */
.stepper-item--completed:not(:last-child)::after {
  background-color: #4f46e5; /* indigo-600 */
}

/* Contenu de l'étape */
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* Conteneur du cercle */
.stepper-circle-container {
  margin-bottom: 0.5rem;
}

/* Cercle avec numéro */
.stepper-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  border: 2px solid;
}

.stepper-circle--completed {
  background-color: #4f46e5; /* indigo-600 */
  border-color: #4f46e5;
  color: white;
}

.stepper-circle--current {
  background-color: #4f46e5; /* indigo-600 */
  border-color: #4f46e5;
  color: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.stepper-circle--pending {
  background-color: white;
  border-color: #d1d5db; /* gray-300 */
  color: #6b7280; /* gray-500 */
}

/* Icône de validation */
.stepper-check-icon {
  width: 1rem;
  height: 1rem;
}

/* Numéro de l'étape */
.stepper-number {
  line-height: 1;
}

/* Contenu textuel */
.stepper-content {
  text-align: center;
  max-width: 8rem;
}

/* Titre de l'étape */
.stepper-title {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease-in-out;
}

.stepper-title--current {
  color: #4f46e5; /* indigo-600 */
}

.stepper-title--completed {
  color: #111827; /* gray-900 */
}

.stepper-title--pending {
  color: #6b7280; /* gray-500 */
}

/* Description de l'étape */
.stepper-description {
  font-size: 0.75rem;
  color: #6b7280; /* gray-500 */
  line-height: 1.25;
}

/* Variantes de taille */
.stepper-container[data-size="sm"] .stepper-circle {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
}

.stepper-container[data-size="sm"] .stepper-title {
  font-size: 0.75rem;
}

.stepper-container[data-size="sm"] .stepper-description {
  font-size: 0.625rem;
}

.stepper-container[data-size="lg"] .stepper-circle {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}

.stepper-container[data-size="lg"] .stepper-title {
  font-size: 1rem;
}

.stepper-container[data-size="lg"] .stepper-description {
  font-size: 0.875rem;
}

/* Variante minimale */
.stepper-container[data-variant="minimal"] .stepper-description {
  display: none;
}

.stepper-container[data-variant="minimal"] .stepper-circle {
  width: 1.5rem;
  height: 1.5rem;
}

.stepper-container[data-variant="minimal"] .stepper-title {
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 640px) {
  .stepper-content {
    max-width: 6rem;
  }
  
  .stepper-title {
    font-size: 0.75rem;
  }
  
  .stepper-description {
    font-size: 0.625rem;
  }
  
  .stepper-circle {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .stepper-content {
    max-width: 4rem;
  }
  
  .stepper-title {
    font-size: 0.625rem;
  }
  
  .stepper-description {
    display: none;
  }
  
  .stepper-circle {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }
}
</style>
