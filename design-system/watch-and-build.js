/**
 * Surveillance des tokens et génération automatique des styles
 * Usage: npm run watch:design-system
 */

import { saveCSS } from './generate-styles.js'
import { watch } from 'fs'
import path from 'path'

console.log('🔍 Surveillance des tokens du design system...')
console.log('📁 Fichier surveillé: design-system/tokens.js')
console.log('🔄 Les styles seront régénérés automatiquement à chaque modification\n')

// Génération initiale
console.log('🚀 Génération initiale...')
saveCSS()

// Surveillance du fichier tokens.js
const tokensPath = path.join(process.cwd(), 'design-system', 'tokens.js')

watch(tokensPath, (eventType, filename) => {
  if (eventType === 'change') {
    console.log(`\n🔄 Changement détecté dans ${filename}`)
    console.log('⚡ Régénération des styles...')
    
    try {
      // Petite temporisation pour éviter les doubles builds
      setTimeout(() => {
        saveCSS()
        console.log('✅ Styles mis à jour!')
        console.log('🔍 En attente de nouveaux changements...\n')
      }, 100)
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error)
    }
  }
})

console.log('🔍 En attente de changements... (Ctrl+C pour arrêter)\n') 