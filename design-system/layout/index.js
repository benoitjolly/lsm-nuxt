/**
 * Layout Components
 * Composants de mise en page pour l'application LSM
 */

export { default as Header } from './Header.vue'
export { default as Footer } from './Footer.vue'

// Export par défaut pour faciliter l'import
export default {
  Header: () => import('./Header.vue'),
  Footer: () => import('./Footer.vue'),
} 