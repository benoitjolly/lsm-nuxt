/**
 * Design System Library
 * Point d'entrée principal pour utiliser le système de design comme une librairie externe
 */

import { designTokens } from './tokens.js'

// Export des tokens pour utilisation directe
export { designTokens }

// Export des composants de layout
export { Header, Footer } from './layout/index.js'

// Export des classes sémantiques
export { semanticClasses }

// Export du CSS des classes utilitaires générées automatiquement
export { default as generatedStyles } from './generated-styles.css'

// Export par défaut pour faciliter l'import
export default designTokens

// Utilitaires helper pour faciliter l'utilisation des tokens
export const ds = {
  // Couleurs
  colors: designTokens.colors,
  
  // Typographie
  typography: designTokens.typography,
  
  // Espacements
  spacing: designTokens.spacing,
  
  // Bordures
  borders: designTokens.borders,
  
  // Ombres
  shadows: designTokens.shadows,
  
  // Transitions
  transitions: designTokens.transitions,
  
  // Layout
  layout: designTokens.layout,
  
  // Z-index
  zIndex: designTokens.zIndex,
  
  // Helpers pour récupérer des valeurs spécifiques
  getColor: (path) => {
    const keys = path.split('.')
    let value = designTokens.colors
    for (const key of keys) {
      value = value[key]
    }
    return value
  },
  
  getSpacing: (key) => designTokens.spacing[key],
  
  getFontSize: (key) => designTokens.typography.fontSize[key],
  
  getBorderRadius: (key) => designTokens.borders.radius[key],
  
  getShadow: (key) => designTokens.shadows[key],
  
  getTransition: (property, duration = '150', timing = 'inOut') => {
    const dur = designTokens.transitions.duration[duration]
    const tim = designTokens.transitions.timing[timing]
    const prop = designTokens.transitions.property[property] || property
    return `${prop} ${dur} ${tim}`
  }
}

// Export des CSS custom properties pour utilisation dans les styles
export const generateCSSVariables = () => {
  const variables = {}
  
  // Couleurs
  Object.entries(designTokens.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      variables[`--ds-color-${colorName}`] = colorValue
    } else {
      Object.entries(colorValue).forEach(([shade, value]) => {
        variables[`--ds-color-${colorName}-${shade}`] = value
      })
    }
  })
  
  // Espacements
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    variables[`--ds-spacing-${key}`] = value
  })
  
  // Tailles de police
  Object.entries(designTokens.typography.fontSize).forEach(([key, value]) => {
    variables[`--ds-font-size-${key}`] = value
  })
  
  // Rayons de bordure
  Object.entries(designTokens.borders.radius).forEach(([key, value]) => {
    variables[`--ds-border-radius-${key}`] = value
  })
  
  // Ombres
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    variables[`--ds-shadow-${key}`] = value
  })
  
  return variables
}

// Export des utilitaires CSS basés sur les tokens sémantiques
export const semanticClasses = {
  // === TYPOGRAPHIE ===
  // Génération automatique des classes de typographie
  ...Object.entries(designTokens.typography.styles).reduce((acc, [key, styles]) => {
    acc[`.text-${key}`] = styles
    return acc
  }, {}),
  
  // === COULEURS SÉMANTIQUES ===
  // Textes
  '.text-primary': { color: designTokens.colors.semantic['text-primary'] },
  '.text-secondary': { color: designTokens.colors.semantic['text-secondary'] },
  '.text-tertiary': { color: designTokens.colors.semantic['text-tertiary'] },
  '.text-disabled': { color: designTokens.colors.semantic['text-disabled'] },
  '.text-inverse': { color: designTokens.colors.semantic['text-inverse'] },
  '.text-accent': { color: designTokens.colors.semantic['text-accent'] },
  '.text-success': { color: designTokens.colors.semantic['text-success'] },
  '.text-warning': { color: designTokens.colors.semantic['text-warning'] },
  '.text-error': { color: designTokens.colors.semantic['text-error'] },
  
  // Arrière-plans
  '.bg-surface-primary': { backgroundColor: designTokens.colors.semantic['surface-primary'] },
  '.bg-surface-secondary': { backgroundColor: designTokens.colors.semantic['surface-secondary'] },
  '.bg-surface-tertiary': { backgroundColor: designTokens.colors.semantic['surface-tertiary'] },
  '.bg-surface-accent': { backgroundColor: designTokens.colors.semantic['surface-accent'] },
  '.bg-surface-accent-subtle': { backgroundColor: designTokens.colors.semantic['surface-accent-subtle'] },
  '.bg-surface-success': { backgroundColor: designTokens.colors.semantic['surface-success'] },
  '.bg-surface-success-subtle': { backgroundColor: designTokens.colors.semantic['surface-success-subtle'] },
  '.bg-surface-warning': { backgroundColor: designTokens.colors.semantic['surface-warning'] },
  '.bg-surface-warning-subtle': { backgroundColor: designTokens.colors.semantic['surface-warning-subtle'] },
  '.bg-surface-error': { backgroundColor: designTokens.colors.semantic['surface-error'] },
  '.bg-surface-error-subtle': { backgroundColor: designTokens.colors.semantic['surface-error-subtle'] },
  
  // Bordures
  '.border-primary': { borderColor: designTokens.colors.semantic['border-primary'] },
  '.border-secondary': { borderColor: designTokens.colors.semantic['border-secondary'] },
  '.border-accent': { borderColor: designTokens.colors.semantic['border-accent'] },
  '.border-success': { borderColor: designTokens.colors.semantic['border-success'] },
  '.border-warning': { borderColor: designTokens.colors.semantic['border-warning'] },
  '.border-error': { borderColor: designTokens.colors.semantic['border-error'] },
  
  // États interactifs
  '.interactive-primary': { 
    backgroundColor: designTokens.colors.semantic['interactive-primary'],
    transition: `${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}`,
  },
  '.interactive-primary:hover': { 
    backgroundColor: designTokens.colors.semantic['interactive-primary-hover'],
  },
  '.interactive-primary:active': { 
    backgroundColor: designTokens.colors.semantic['interactive-primary-active'],
  },
  '.interactive-secondary': { 
    backgroundColor: designTokens.colors.semantic['interactive-secondary'],
    transition: `${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}`,
  },
  '.interactive-secondary:hover': { 
    backgroundColor: designTokens.colors.semantic['interactive-secondary-hover'],
  },
  '.interactive-secondary:active': { 
    backgroundColor: designTokens.colors.semantic['interactive-secondary-active'],
  },
  
  // === OMBRES ===
  '.shadow-sm': { boxShadow: designTokens.shadows.sm },
  '.shadow-default': { boxShadow: designTokens.shadows.DEFAULT },
  '.shadow-md': { boxShadow: designTokens.shadows.md },
  '.shadow-lg': { boxShadow: designTokens.shadows.lg },
  '.shadow-xl': { boxShadow: designTokens.shadows.xl },
  
  // === TRANSITIONS ===
  '.transition-colors': { 
    transition: `${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}` 
  },
  '.transition-transform': { 
    transition: `${designTokens.transitions.property.transform} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}` 
  },
  '.transition-all': { 
    transition: `${designTokens.transitions.property.all} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}` 
  },
}

// Export des utilitaires Tailwind personnalisés (legacy - à supprimer progressivement)
export const tailwindUtilities = {
  // Couleurs personnalisées basées sur les tokens
  '.bg-ds-primary': { backgroundColor: designTokens.colors.primary[600] },
  '.bg-ds-primary-hover': { backgroundColor: designTokens.colors.primary[700] },
  '.text-ds-primary': { color: designTokens.colors.primary[600] },
  '.text-ds-neutral': { color: designTokens.colors.neutral[700] },
  '.text-ds-neutral-light': { color: designTokens.colors.neutral[500] },
  '.text-ds-error': { color: designTokens.colors.error[600] },
  '.text-ds-success': { color: designTokens.colors.success[600] },
  '.text-ds-warning': { color: designTokens.colors.warning[700] },
  
  // Bordures personnalisées
  '.border-ds-primary': { borderColor: designTokens.colors.primary[600] },
  '.border-ds-neutral': { borderColor: designTokens.colors.neutral[300] },
  '.border-ds-error': { borderColor: designTokens.colors.error[600] },
  
  // Ombres personnalisées
  '.shadow-ds': { boxShadow: designTokens.shadows.DEFAULT },
  '.shadow-ds-md': { boxShadow: designTokens.shadows.md },
  '.shadow-ds-lg': { boxShadow: designTokens.shadows.lg },
  
  // Transitions personnalisées
  '.transition-ds': { 
    transition: `${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}` 
  },
  '.transition-ds-transform': { 
    transition: `${designTokens.transitions.property.transform} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut}` 
  },
} 