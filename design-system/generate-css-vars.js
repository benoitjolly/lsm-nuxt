#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { tokens } from './tokens/index.js'

/**
 * Convertit un nom de token en variable CSS
 */
function tokenToCSSVar(category, name) {
  const kebabName = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  return `--${category}-${kebabName}`
}

/**
 * Convertit un objet de tokens en variables CSS
 */
function generateCSSVars(obj, category = '', prefix = '') {
  let css = ''
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKey = prefix ? `${prefix}-${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      css += generateCSSVars(value, category, currentKey)
    } else {
      const varName = tokenToCSSVar(category, currentKey)
      const cssValue = Array.isArray(value) ? value.join(', ') : value
      css += `  ${varName}: ${cssValue};\n`
    }
  }
  
  return css
}

/**
 * Génère le fichier CSS avec toutes les variables
 */
function generateCSSFile() {
  let css = `/**
 * CSS Variables générées automatiquement depuis les tokens de design
 * 🚨 NE PAS MODIFIER MANUELLEMENT - Utiliser npm run tokens:build
 */

:root {
`

  // Génère les variables pour chaque catégorie (base)
  css += generateCSSVars(tokens.colors, 'color')
  css += generateCSSVars(tokens.spacing, 'spacing')
  css += generateCSSVars(tokens.typography.fontSize, 'font-size')
  css += generateCSSVars(tokens.typography.fontWeight, 'font-weight')
  css += generateCSSVars(tokens.typography.lineHeight, 'line-height')
  css += generateCSSVars(tokens.typography.letterSpacing, 'letter-spacing')
  css += generateCSSVars(tokens.effects.shadows, 'shadow')
  css += generateCSSVars(tokens.effects.borders, 'border')
  css += generateCSSVars(tokens.effects.transitions, 'transition')

  css += '}\n\n'

  // Ajoute les variables des thèmes
  css += generateThemeVariables()

  // Ajoute les classes utilitaires sémantiques
  css += generateUtilityClasses()

  return css
}

/**
 * Génère les variables CSS pour les thèmes
 */
function generateThemeVariables() {
  let css = `/* === VARIABLES DE THÈMES === */\n\n`
  
  // Thème light (par défaut)
  css += `[data-theme="light"],\n:root {\n`
  css += generateThemeVars(tokens.themes.light, 'theme')
  css += generateThemeVars(tokens.themes.semantic.light, 'semantic')
  css += '}\n\n'
  
  // Thème dark
  css += `[data-theme="dark"] {\n`
  css += generateThemeVars(tokens.themes.dark, 'theme')
  css += generateThemeVars(tokens.themes.semantic.dark, 'semantic')
  css += '}\n\n'
  
  // Support du mode dark automatique
  css += `@media (prefers-color-scheme: dark) {\n`
  css += `  :root:not([data-theme]) {\n`
  css += generateThemeVars(tokens.themes.dark, 'theme', '    ')
  css += generateThemeVars(tokens.themes.semantic.dark, 'semantic', '    ')
  css += '  }\n'
  css += '}\n\n'
  
  return css
}

/**
 * Génère les variables CSS pour un thème spécifique
 */
function generateThemeVars(obj, prefix = '', indent = '  ') {
  let css = ''
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKey = `${prefix}-${key}`
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      css += generateThemeVars(value, currentKey, indent)
    } else {
      const varName = tokenToCSSVar('', currentKey)
      const cssValue = Array.isArray(value) ? value.join(', ') : value
      css += `${indent}${varName}: ${cssValue};\n`
    }
  }
  
  return css
}

/**
 * Génère les classes utilitaires basées sur les tokens sémantiques
 */
function generateUtilityClasses() {
  let css = `/* === CLASSES UTILITAIRES SÉMANTIQUES === */\n\n`

  // Classes de texte (utilisant les variables de thème)
  css += `.text-primary { color: var(--theme-text-primary); }\n`
  css += `.text-secondary { color: var(--theme-text-secondary); }\n`
  css += `.text-tertiary { color: var(--theme-text-tertiary); }\n`
  css += `.text-disabled { color: var(--theme-text-disabled); }\n`
  css += `.text-inverse { color: var(--theme-text-inverse); }\n\n`

  // Classes de background
  css += `.bg-primary { background-color: var(--theme-surface-primary); }\n`
  css += `.bg-secondary { background-color: var(--theme-surface-secondary); }\n`
  css += `.bg-tertiary { background-color: var(--theme-surface-tertiary); }\n`
  css += `.bg-inverse { background-color: var(--theme-surface-inverse); }\n\n`

  // Classes de bordure
  css += `.border-primary { border-color: var(--theme-border-primary); }\n`
  css += `.border-secondary { border-color: var(--theme-border-secondary); }\n`
  css += `.border-tertiary { border-color: var(--theme-border-tertiary); }\n\n`

  // Classes sémantiques (couleurs d'état)
  const semanticColors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
  
  for (const color of semanticColors) {
    css += `.text-${color} { color: var(--semantic-${color}-base); }\n`
    css += `.bg-${color} { background-color: var(--semantic-${color}-base); }\n`
    css += `.bg-${color}-subtle { background-color: var(--semantic-${color}-subtle); }\n`
    css += `.bg-${color}-muted { background-color: var(--semantic-${color}-muted); }\n`
    css += `.border-${color} { border-color: var(--semantic-${color}-base); }\n`
    css += `.hover\\:bg-${color}-hover:hover { background-color: var(--semantic-${color}-hover); }\n`
    css += `.active\\:bg-${color}-active:active { background-color: var(--semantic-${color}-active); }\n`
  }
  css += '\n'

  // Classes typographiques sémantiques
  for (const [category, styles] of Object.entries(tokens.typography.semantic)) {
    if (typeof styles === 'object' && styles !== null) {
      for (const [variant, properties] of Object.entries(styles)) {
        const className = category === 'body' || category === 'label' ? 
          `${category}-${variant}` : 
          category === 'heading' ? variant : category

        css += `.text-${className} {\n`
        
        for (const [prop, value] of Object.entries(properties)) {
          const cssValue = typeof value === 'string' && tokens.typography[prop] ? 
            tokens.typography[prop][value] || value : value
          
          switch (prop) {
            case 'fontSize':
              css += `  font-size: ${cssValue};\n`
              break
            case 'fontWeight':
              css += `  font-weight: ${cssValue};\n`
              break
            case 'lineHeight':
              css += `  line-height: ${cssValue};\n`
              break
            case 'letterSpacing':
              css += `  letter-spacing: ${cssValue};\n`
              break
            case 'textTransform':
              css += `  text-transform: ${cssValue};\n`
              break
          }
        }
        
        css += '}\n\n'
      }
    }
  }

  // Classes d'espacement sémantiques
  for (const [name, value] of Object.entries(tokens.spacing.semantic)) {
    const spacingValue = tokens.spacing[value] || value
    css += `.space-${name} { gap: ${spacingValue}; }\n`
    css += `.p-${name} { padding: ${spacingValue}; }\n`
    css += `.m-${name} { margin: ${spacingValue}; }\n`
  }
  css += '\n'

  // Classes d'élévation sémantiques
  for (const [name, value] of Object.entries(tokens.effects.semantic.elevation)) {
    const shadowValue = tokens.effects.shadows[value] || value
    css += `.elevation-${name} { box-shadow: ${shadowValue}; }\n`
  }

  return css
}

/**
 * Génère aussi un fichier JSON avec toutes les variables CSS pour JavaScript
 */
function generateJSFile() {
  const cssVars = {}
  
  function addVarsToObject(obj, category = '', prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentKey = prefix ? `${prefix}-${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        addVarsToObject(value, category, currentKey)
      } else {
        const varName = tokenToCSSVar(category, currentKey)
        cssVars[varName] = Array.isArray(value) ? value.join(', ') : value
      }
    }
  }

  addVarsToObject(tokens.colors, 'color')
  addVarsToObject(tokens.spacing, 'spacing')
  addVarsToObject(tokens.typography.fontSize, 'font-size')
  addVarsToObject(tokens.typography.fontWeight, 'font-weight')
  addVarsToObject(tokens.typography.lineHeight, 'line-height')
  addVarsToObject(tokens.typography.letterSpacing, 'letter-spacing')
  addVarsToObject(tokens.effects.shadows, 'shadow')
  addVarsToObject(tokens.effects.borders, 'border')
  addVarsToObject(tokens.effects.transitions, 'transition')

  const jsContent = `/**
 * Variables CSS générées automatiquement depuis les tokens de design
 * 🚨 NE PAS MODIFIER MANUELLEMENT - Utiliser npm run tokens:build
 */

export const cssVars = ${JSON.stringify(cssVars, null, 2)}

export const getCSSVar = (varName) => \`var(\${varName})\`

export default cssVars`

  return jsContent
}

// Génère les fichiers
const outputDir = process.cwd() // Nous sommes déjà dans design-system
const cssContent = generateCSSFile()
const jsContent = generateJSFile()

fs.writeFileSync(path.join(outputDir, 'css-variables.css'), cssContent)
fs.writeFileSync(path.join(outputDir, 'css-variables.js'), jsContent)

console.log('✅ Fichiers CSS variables générés avec succès !')
console.log('📁 design-system/css-variables.css')
console.log('📁 design-system/css-variables.js')
console.log(`📊 ${Object.keys(JSON.parse(jsContent.match(/export const cssVars = ({.*?})/s)[1])).length} variables CSS générées`)