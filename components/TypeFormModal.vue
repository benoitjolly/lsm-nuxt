<template>
  <div class="type-form-modal">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nom du type -->
      <div>
        <label for="typeName" class="block text-sm font-medium text-gray-700 mb-2">
          Nom du type *
        </label>
        <Input
          id="typeName"
          v-model="formData.nom"
          type="text"
          placeholder="Entrez le nom du type"
          required
          :disabled="loading"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="typeDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="typeDescription"
          v-model="formData.description"
          rows="3"
          class="input-field"
          placeholder="Entrez une description (optionnel)"
          :disabled="loading"
        />
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="error-message">
        <Alert variant="error">
          {{ error }}
        </Alert>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <Button 
          type="button" 
          @click="handleCancel" 
          variant="secondary"
          :disabled="loading"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          :disabled="loading || !formData.nom.trim()"
        >
          <span v-if="loading">{{ isEditing ? 'Modification...' : 'Ajout...' }}</span>
          <span v-else>{{ isEditing ? 'Modifier' : 'Ajouter' }}</span>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Button, Input, Alert } from '~/design-system/components'
import type { TypeSerrure } from '~/types/typeSerrure'

interface Props {
  initialType?: Partial<TypeSerrure>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [type: TypeSerrure]
  cancel: []
  unauthorized: []
}>()

// État du formulaire
const formData = ref<TypeSerrure>({
  nom: '',
  description: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

// Vérifier si on est en mode édition
const isEditing = computed(() => {
  return props.initialType && props.initialType.id
})

// Watcher pour initialiser le formulaire avec les données existantes
watch(() => props.initialType, (newType) => {
  if (newType) {
    formData.value = {
      id: newType.id,
      nom: newType.nom || '',
      description: newType.description || ''
    }
  } else {
    // Réinitialiser le formulaire pour un nouveau type
    formData.value = {
      nom: '',
      description: ''
    }
  }
  error.value = null
}, { immediate: true })

// Fonction de soumission
const handleSubmit = async () => {
  if (!formData.value.nom.trim()) {
    error.value = 'Le nom du type est requis'
    return
  }

  loading.value = true
  error.value = null

  try {
    emit('submit', { ...formData.value })
  } catch (err) {
    console.error('Erreur lors de la soumission:', err)
    error.value = 'Une erreur est survenue lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.type-form-modal {
  /* Le Modal parent gère déjà le padding */
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>