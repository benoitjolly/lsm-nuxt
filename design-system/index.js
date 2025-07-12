/**
 * Design System Library
 * Point d'entrée principal pour utiliser le système de design comme une librairie externe
 */

import { designTokens } from './tokens.js'

// Export des tokens pour utilisation directe
export { designTokens }

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

// Export des utilitaires Tailwind personnalisés
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