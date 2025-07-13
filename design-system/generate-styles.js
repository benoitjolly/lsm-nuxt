/**
 * Générateur automatique de classes CSS à partir des tokens
 * Usage: node design-system/generate-styles.js
 */

import { designTokens } from './tokens.js'
import fs from 'fs'
import path from 'path'

/**
 * Génère les classes de typographie
 */
function generateTypographyClasses() {
  let css = '/* === TYPOGRAPHIE === */\n'
  
  Object.entries(designTokens.typography.styles).forEach(([name, styles]) => {
    css += `.text-${name} {\n`
    css += `  font-size: ${styles.fontSize};\n`
    css += `  font-weight: ${styles.fontWeight};\n`
    css += `  line-height: ${styles.lineHeight};\n`
    css += `  font-family: ${styles.fontFamily};\n`
    
    if (styles.textTransform) {
      css += `  text-transform: ${styles.textTransform};\n`
    }
    if (styles.letterSpacing) {
      css += `  letter-spacing: ${styles.letterSpacing};\n`
    }
    
    css += '}\n\n'
  })
  
  return css
}

/**
 * Génère les classes de couleurs sémantiques
 */
function generateSemanticColorClasses() {
  let css = '/* === COULEURS SÉMANTIQUES === */\n'
  
  // Couleurs de texte
  Object.entries(designTokens.colors.semantic).forEach(([name, color]) => {
    if (name.startsWith('text-')) {
      const className = name // text-primary, text-secondary, etc.
      css += `.${className} {\n`
      css += `  color: ${color};\n`
      css += '}\n\n'
    }
    
    if (name.startsWith('surface-')) {
      const className = name.replace('surface-', 'bg-surface-') // bg-surface-primary, etc.
      css += `.${className} {\n`
      css += `  background-color: ${color};\n`
      css += '}\n\n'
    }
    
    if (name.startsWith('border-')) {
      const className = name // border-primary, etc.
      css += `.${className} {\n`
      css += `  border-color: ${color};\n`
      css += '}\n\n'
    }
    
    if (name.startsWith('interactive-')) {
      const className = name // interactive-primary, etc.
      css += `.${className} {\n`
      css += `  background-color: ${color};\n`
      css += `  transition: ${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut};\n`
      css += '}\n\n'
      
      // États hover et active
      if (designTokens.colors.semantic[`${name}-hover`]) {
        css += `.${className}:hover {\n`
        css += `  background-color: ${designTokens.colors.semantic[`${name}-hover`]};\n`
        css += '}\n\n'
      }
      
      if (designTokens.colors.semantic[`${name}-active`]) {
        css += `.${className}:active {\n`
        css += `  background-color: ${designTokens.colors.semantic[`${name}-active`]};\n`
        css += '}\n\n'
      }
    }
  })
  
  return css
}

/**
 * Génère les classes d'ombres
 */
function generateShadowClasses() {
  let css = '/* === OMBRES === */\n'
  
  Object.entries(designTokens.shadows).forEach(([name, shadow]) => {
    const className = name === 'DEFAULT' ? 'shadow-default' : `shadow-${name}`
    css += `.${className} {\n`
    css += `  box-shadow: ${shadow};\n`
    css += '}\n\n'
  })
  
  return css
}

/**
 * Génère les classes de transitions
 */
function generateTransitionClasses() {
  let css = '/* === TRANSITIONS === */\n'
  
  Object.entries(designTokens.transitions.property).forEach(([name, property]) => {
    css += `.transition-${name} {\n`
    css += `  transition: ${property} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut};\n`
    css += '}\n\n'
  })
  
  return css
}

/**
 * Génère les classes de boutons
 */
function generateButtonClasses() {
  let css = '/* === BOUTONS === */\n'
  
  // Bouton primaire
  css += '.button-primary {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-primary']};\n`
  css += `  color: ${designTokens.colors.semantic['text-inverse']};\n`
  css += `  padding: ${designTokens.spacing[2]} ${designTokens.spacing[4]};\n`
  css += `  border-radius: ${designTokens.borders.radius.md};\n`
  css += `  font-weight: ${designTokens.typography.fontWeight.medium};\n`
  css += `  font-size: ${designTokens.typography.fontSize.base};\n`
  css += `  border: none;\n`
  css += `  cursor: pointer;\n`
  css += `  transition: ${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut};\n`
  css += '}\n\n'
  
  css += '.button-primary:hover {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-primary-hover']};\n`
  css += '}\n\n'
  
  css += '.button-primary:active {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-primary-active']};\n`
  css += '}\n\n'
  
  // Bouton secondaire
  css += '.button-secondary {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-secondary']};\n`
  css += `  color: ${designTokens.colors.semantic['text-primary']};\n`
  css += `  padding: ${designTokens.spacing[2]} ${designTokens.spacing[4]};\n`
  css += `  border-radius: ${designTokens.borders.radius.md};\n`
  css += `  font-weight: ${designTokens.typography.fontWeight.medium};\n`
  css += `  font-size: ${designTokens.typography.fontSize.base};\n`
  css += `  border: 1px solid ${designTokens.colors.semantic['border-primary']};\n`
  css += `  cursor: pointer;\n`
  css += `  transition: ${designTokens.transitions.property.colors} ${designTokens.transitions.duration[150]} ${designTokens.transitions.timing.inOut};\n`
  css += '}\n\n'
  
  css += '.button-secondary:hover {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-secondary-hover']};\n`
  css += '}\n\n'
  
  css += '.button-secondary:active {\n'
  css += `  background-color: ${designTokens.colors.semantic['interactive-secondary-active']};\n`
  css += '}\n\n'
  
  return css
}

/**
 * Génère les classes de layout
 */
function generateLayoutClasses() {
  let css = '/* === LAYOUT === */\n'
  
  // Container
  css += '.container {\n'
  css += `  max-width: ${designTokens.layout.container['2xl']};\n`
  css += '  margin: 0 auto;\n'
  css += `  padding: 0 ${designTokens.spacing[4]};\n`
  css += '}\n\n'
  
  css += '@media (min-width: 640px) {\n'
  css += '  .container {\n'
  css += `    padding: 0 ${designTokens.spacing[6]};\n`
  css += '  }\n'
  css += '}\n\n'
  
  css += '@media (min-width: 1024px) {\n'
  css += '  .container {\n'
  css += `    padding: 0 ${designTokens.spacing[8]};\n`
  css += '  }\n'
  css += '}\n\n'
  
  // Card
  css += '.card {\n'
  css += `  background-color: ${designTokens.colors.semantic['surface-primary']};\n`
  css += `  border: 1px solid ${designTokens.colors.semantic['border-primary']};\n`
  css += `  border-radius: ${designTokens.borders.radius.lg};\n`
  css += `  box-shadow: ${designTokens.shadows.DEFAULT};\n`
  css += `  padding: ${designTokens.spacing[6]};\n`
  css += '}\n\n'
  
  return css
}

/**
 * Génère le fichier CSS complet
 */
function generateCSS() {
  const header = `/**
 * Design System - Classes utilitaires
 * 🤖 Généré automatiquement à partir des tokens
 * ⚠️  Ne pas modifier manuellement ce fichier
 * 
 * Pour régénérer: npm run build:design-system
 */

`

  let css = header
  css += generateTypographyClasses()
  css += generateSemanticColorClasses()
  css += generateShadowClasses()
  css += generateTransitionClasses()
  css += generateButtonClasses()
  css += generateLayoutClasses()
  
  return css
}

/**
 * Sauvegarde le CSS généré
 */
function saveCSS() {
  const css = generateCSS()
  const outputPath = path.join(process.cwd(), 'design-system', 'generated-styles.css')
  
  fs.writeFileSync(outputPath, css, 'utf8')
  
  console.log('✅ Classes CSS générées avec succès!')
  console.log(`📁 Fichier créé: ${outputPath}`)
  console.log(`📊 ${css.split('\n').length} lignes générées`)
  
  // Statistiques
  const typographyCount = Object.keys(designTokens.typography.styles).length
  const semanticColorCount = Object.keys(designTokens.colors.semantic).length
  
  console.log(`\n📈 Statistiques:`)
  console.log(`   - ${typographyCount} styles typographiques`)
  console.log(`   - ${semanticColorCount} couleurs sémantiques`)
  console.log(`   - Classes générées automatiquement`)
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  saveCSS()
}

export { generateCSS, saveCSS } 