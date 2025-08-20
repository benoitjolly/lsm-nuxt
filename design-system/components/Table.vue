<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :class="[
              'px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              column.hidden && column.hidden
            ]"
          >
            {{ column.label }}
          </th>
          <th v-if="hasActions" scope="col" class="relative px-3 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading" class="hover:bg-gray-50">
          <td :colspan="totalColumns" class="px-3 py-8 text-center text-gray-500">
            <div class="flex justify-center items-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span class="ml-2">Chargement...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="data.length === 0" class="hover:bg-gray-50">
          <td :colspan="totalColumns" class="px-3 py-8 text-center text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-else v-for="(item, index) in data" :key="getRowKey(item, index)" class="hover:bg-gray-50">
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-3 py-4 whitespace-nowrap',
              column.hidden && column.hidden
            ]"
          >
            <slot
              :name="`cell-${column.key}`"
              :item="item"
              :value="getNestedValue(item, column.key)"
              :index="index"
            >
              <span :class="column.cellClass">
                {{ formatCellValue(getNestedValue(item, column.key), column) }}
              </span>
            </slot>
          </td>
          <td v-if="hasActions" class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" :index="index" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (columns) => columns.every(col => col.key && col.label)
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'Aucune donnée disponible'
  },
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})

const hasActions = computed(() => !!slots.actions)

const totalColumns = computed(() => {
  return props.columns.length + (hasActions.value ? 1 : 0)
})

const { slots } = getCurrentInstance()

const getRowKey = (item, index) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return item[props.rowKey] || index
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatCellValue = (value, column) => {
  if (value === null || value === undefined) {
    return column.emptyText || '-'
  }
  
  switch (column.type) {
    case 'date':
      return formatDate(value, column.dateFormat)
    case 'datetime':
      return formatDateTime(value, column.dateFormat)
    case 'number':
      return formatNumber(value, column.numberFormat)
    case 'currency':
      return formatCurrency(value, column.currency)
    case 'boolean':
      return value ? (column.trueText || 'Oui') : (column.falseText || 'Non')
    default:
      return value
  }
}

const formatDate = (timestamp, format = 'short') => {
  if (!timestamp) return 'Jamais'
  
  const date = new Date(timestamp)
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    case 'long':
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'relative':
      return formatRelativeDate(date)
    default:
      return date.toLocaleDateString('fr-FR')
  }
}

const formatDateTime = (timestamp, format = 'short') => {
  if (!timestamp) return 'Jamais'
  
  const date = new Date(timestamp)
  
  switch (format) {
    case 'short':
      return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    case 'long':
      return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    default:
      return date.toLocaleString('fr-FR')
  }
}

const formatNumber = (value, options = {}) => {
  return new Intl.NumberFormat('fr-FR', options).format(value)
}

const formatCurrency = (value, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(value)
}

const formatRelativeDate = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'Il y a quelques secondes'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`
  if (diffInSeconds < 31536000) return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`
  return `Il y a ${Math.floor(diffInSeconds / 31536000)} ans`
}
</script>

<style scoped>
/* Styles spécifiques au composant Table */
</style> 