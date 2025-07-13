/**
 * Design System Components
 * Composants réutilisables basés sur les tokens sémantiques
 */

export { default as Button } from './Button.vue'
export { default as Input } from './Input.vue'
export { default as AuthLink } from './AuthLink.vue'
export { default as Separator } from './Separator.vue'

// Export par défaut pour faciliter l'import
export default {
  Button: () => import('./Button.vue'),
  Input: () => import('./Input.vue'),
  AuthLink: () => import('./AuthLink.vue'),
  Separator: () => import('./Separator.vue'),
} 