<template>
  <div class="tabs-container">
    <!-- Navigation des onglets -->
    <div class="tabs-nav-border">
      <nav class="tabs-nav" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'tab-button',
            activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
          ]"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          type="button"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Contenu des onglets -->
    <div class="tabs-content">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { designTokens } from '~/design-system/tokens.js'

export interface Tab {
  id: string
  label: string
}

interface Props {
  tabs: Tab[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Onglet actif
const activeTab = ref(props.modelValue || (props.tabs.length > 0 ? props.tabs[0].id : ''))

// Watcher pour synchroniser avec v-model
watch(activeTab, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watcher pour synchroniser avec modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-nav-border {
  border-bottom: v-bind('designTokens.borders.width.DEFAULT') solid v-bind('designTokens.colors.semantic["border-primary"]');
  margin-bottom: v-bind('designTokens.spacing[2]');
}

.tabs-nav {
  display: flex;
  gap: v-bind('designTokens.spacing[1]');
  padding: 0 v-bind('designTokens.spacing[1]');
}

.tab-button {
  position: relative;
  white-space: nowrap;
  padding: v-bind('designTokens.spacing[4]') v-bind('designTokens.spacing[6]');
  border-bottom: 3px solid transparent;
  font-weight: v-bind('designTokens.typography.fontWeight.medium');
  font-size: v-bind('designTokens.typography.fontSize.base');
  line-height: v-bind('designTokens.typography.lineHeight.normal');
  font-family: v-bind('designTokens.typography.fontFamily.sans.join(", ")');
  background: transparent;
  border-radius: v-bind('designTokens.borders.radius.md') v-bind('designTokens.borders.radius.md') 0 0;
  transition: v-bind('designTokens.transitions.property.colors') v-bind('designTokens.transitions.duration[200]') v-bind('designTokens.transitions.timing.inOut');
  cursor: pointer;
  margin-bottom: -1px;
}

.tab-button-active {
  color: v-bind('designTokens.colors.semantic["text-accent"]');
  border-bottom-color: v-bind('designTokens.colors.semantic["border-accent"]');
  background-color: v-bind('designTokens.colors.semantic["surface-primary"]');
}

.tab-button-inactive {
  color: v-bind('designTokens.colors.semantic["text-secondary"]');
  border-bottom-color: transparent;
}

.tab-button-inactive:hover {
  color: v-bind('designTokens.colors.semantic["text-primary"]');
  background-color: v-bind('designTokens.colors.semantic["surface-secondary"]');
  border-bottom-color: v-bind('designTokens.colors.semantic["border-secondary"]');
}

.tabs-content {
  padding-top: v-bind('designTokens.spacing[6]');
}
</style> 