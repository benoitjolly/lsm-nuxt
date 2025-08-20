<template>
  <button
    @click="toggleTheme"
    :class="buttonClasses"
    :title="currentTheme === 'dark' ? 'Basculer en mode clair' : 'Basculer en mode sombre'"
    type="button"
  >
    <!-- Icône Soleil (mode light) -->
    <svg 
      v-if="currentTheme === 'light'"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      class="theme-icon"
    >
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
    
    <!-- Icône Lune (mode dark) -->
    <svg 
      v-else
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      class="theme-icon"
    >
      <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
    </svg>
    
    <span v-if="showLabel" class="theme-label">
      {{ currentTheme === 'dark' ? 'Mode clair' : 'Mode sombre' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { designTokens } from '~/design-system/tokens.js'

interface Props {
  size?: 'sm' | 'base' | 'lg'
  variant?: 'subtle' | 'outlined' | 'ghost'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'base',
  variant: 'subtle',
  showLabel: false
})

const currentTheme = ref<'light' | 'dark' | 'auto'>('auto')

/**
 * Initialise le thème depuis localStorage ou système
 */
const initTheme = () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    if (savedTheme) {
      currentTheme.value = savedTheme
      applyTheme(savedTheme)
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
      applyTheme(currentTheme.value)
    }
  }
}

/**
 * Applique le thème au document
 */
const applyTheme = (theme: 'light' | 'dark') => {
  if (process.client) {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

/**
 * Bascule entre les thèmes
 */
const toggleTheme = () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  currentTheme.value = newTheme
  
  applyTheme(newTheme)
  
  if (process.client) {
    localStorage.setItem('theme', newTheme)
  }
}

/**
 * Classes CSS du bouton basées sur les props
 */
const buttonClasses = computed(() => {
  const baseClasses = [
    'theme-toggle',
    'inline-flex',
    'items-center',
    'justify-center',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-indigo-500'
  ]

  // Taille
  if (props.size === 'sm') {
    baseClasses.push('p-1.5')
  } else if (props.size === 'lg') {
    baseClasses.push('p-3')
  } else {
    baseClasses.push('p-2')
  }

  // Variante
  if (props.variant === 'outlined') {
    baseClasses.push('border', 'border-gray-300', 'rounded-md')
  } else if (props.variant === 'ghost') {
    baseClasses.push('hover:bg-gray-100', 'rounded-md')
  } else {
    baseClasses.push('bg-gray-100', 'hover:bg-gray-200', 'rounded-md')
  }

  // Label
  if (props.showLabel) {
    baseClasses.push('gap-2')
  }

  return baseClasses.join(' ')
})

// Initialiser le thème au montage
onMounted(() => {
  initTheme()
  
  // Écouter les changements de préférence système
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Seulement si aucun thème n'est sauvegardé
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        currentTheme.value = newTheme
        applyTheme(newTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
})

// Exposer pour l'usage externe
defineExpose({
  currentTheme,
  toggleTheme,
  applyTheme
})
</script>

<style scoped>
.theme-toggle {
  color: v-bind('designTokens.colors.semantic["text-primary"]');
  border-radius: v-bind('designTokens.borders.radius.md');
  transition: v-bind('designTokens.transitions.property.colors') v-bind('designTokens.transitions.duration[200]') v-bind('designTokens.transitions.timing.inOut');
}

.theme-toggle:hover {
  color: v-bind('designTokens.colors.semantic["text-accent"]');
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-label {
  font-size: v-bind('designTokens.typography.fontSize.sm');
  font-weight: v-bind('designTokens.typography.fontWeight.medium');
  line-height: v-bind('designTokens.typography.lineHeight.normal');
}

/* Variantes avec tokens de design */
.theme-toggle.variant-outlined {
  border-color: v-bind('designTokens.colors.semantic["border-primary"]');
}

.theme-toggle.variant-outlined:hover {
  border-color: v-bind('designTokens.colors.semantic["border-accent"]');
}

.theme-toggle.variant-ghost:hover {
  background-color: v-bind('designTokens.colors.semantic["surface-secondary"]');
}

.theme-toggle.variant-subtle {
  background-color: v-bind('designTokens.colors.semantic["surface-secondary"]');
}

.theme-toggle.variant-subtle:hover {
  background-color: v-bind('designTokens.colors.semantic["surface-tertiary"]');
}

/* Support du mode dark via variables CSS */
[data-theme="dark"] .theme-toggle {
  color: var(--theme-text-primary);
}

[data-theme="dark"] .theme-toggle:hover {
  color: var(--semantic-primary-base);
}

[data-theme="dark"] .theme-toggle.variant-outlined {
  border-color: var(--theme-border-primary);
}

[data-theme="dark"] .theme-toggle.variant-outlined:hover {
  border-color: var(--semantic-primary-base);
}

[data-theme="dark"] .theme-toggle.variant-ghost:hover {
  background-color: var(--theme-surface-secondary);
}

[data-theme="dark"] .theme-toggle.variant-subtle {
  background-color: var(--theme-surface-secondary);
}

[data-theme="dark"] .theme-toggle.variant-subtle:hover {
  background-color: var(--theme-surface-tertiary);
}
</style>