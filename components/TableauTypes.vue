<template>
  <div class="tableau-types">
    <div class="header-section">
      <div class="title-section">
        <h2 class="title">{{ title }}</h2>
        <p v-if="description" class="description">{{ description }}</p>
      </div>
      
      <div v-if="showAddButton && canEdit" class="actions-section">
        <Button @click="$emit('add-type')" variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un type
        </Button>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-text">Chargement des types...</p>
    </div>

    <!-- Tableau des types -->
    <div v-else-if="types.length > 0" class="table-container">
      <table class="types-table">
        <thead class="table-header">
          <tr>
            <th class="header-cell">Nom</th>
            <th class="header-cell">Description</th>
            <th v-if="canEdit" class="header-cell actions-header">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="type in types" :key="type.id" class="table-row">
            <td class="table-cell">
              <div class="cell-content">
                <span class="type-name">{{ type.nom }}</span>
              </div>
            </td>
            <td class="table-cell">
              <div class="cell-content">
                <span class="type-description">{{ type.description || 'Aucune description' }}</span>
              </div>
            </td>
            <td v-if="canEdit" class="table-cell actions-cell">
              <div class="actions-group">
                <Button 
                  @click="$emit('edit-type', type)" 
                  variant="secondary" 
                  size="sm"
                  title="Modifier le type"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
                <Button 
                  @click="type.id && $emit('delete-type', type.id)" 
                  variant="danger" 
                  size="sm"
                  title="Supprimer le type"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- État vide -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="empty-title">Aucun type de serrure</h3>
      <p class="empty-description">Commencez par créer votre premier type de serrure.</p>
      <div v-if="showAddButton && canEdit" class="empty-action">
        <Button @click="$emit('add-type')" variant="primary">
          Ajouter le premier type
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Button } from '~/design-system/components'
import type { TypeSerrure } from '~/types/typeSerrure'

interface Props {
  types: TypeSerrure[]
  loading?: boolean
  canEdit?: boolean
  showAddButton?: boolean
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  canEdit: false,
  showAddButton: true,
  title: 'Types de serrures',
  description: 'Gestion des différents types de serrures'
})

defineEmits<{
  'add-type': []
  'edit-type': [type: TypeSerrure]
  'delete-type': [id: string]
}>()
</script>

<style scoped>
.tableau-types {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.title-section {
  flex: 1;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.description {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.actions-section {
  margin-left: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.table-container {
  overflow-x: auto;
}

.types-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: #f9fafb;
}

.header-cell {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.actions-header {
  text-align: center;
  width: 120px;
}

.table-body .table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-body .table-row:hover {
  background-color: #f9fafb;
}

.table-cell {
  padding: 1rem 1.5rem;
  vertical-align: top;
}

.cell-content {
  display: flex;
  align-items: center;
}

.type-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.type-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.actions-cell {
  text-align: center;
}

.actions-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
}

.empty-action {
  margin-top: 0.5rem;
}
</style>