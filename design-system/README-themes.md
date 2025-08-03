# 🌓 Système de Thèmes Light/Dark

Un système complet de gestion des thèmes avec support automatique du mode sombre et inversion intelligente des couleurs.

## 🚀 Intégration rapide

### 1. Importer le CSS

```css
/* Dans votre fichier CSS principal */
@import url('./design-system/theme.css');
```

### 2. Ajouter le toggle de thème

```vue
<template>
  <ThemeToggle />
</template>

<script setup>
import { ThemeToggle } from '~/design-system/components'
</script>
```

## 📱 Fonctionnalités

### ✅ **Détection automatique**
- Respect de `prefers-color-scheme`
- Sauvegarde des préférences utilisateur
- Basculement manuel possible

### ✅ **Variables CSS intelligentes**
- Inversion automatique des couleurs
- Ajustement de l'opacité pour les modes
- Support complet des navigateurs modernes

### ✅ **Transitions fluides**
- Animation douce entre les thèmes
- Respect de `prefers-reduced-motion`
- Performance optimisée

## 🎨 Variables disponibles

### Variables de thème (s'adaptent automatiquement)

```css
/* Surfaces */
--theme-surface-primary    /* Arrière-plan principal */
--theme-surface-secondary  /* Arrière-plan secondaire */
--theme-surface-tertiary   /* Arrière-plan tertiaire */
--theme-surface-inverse    /* Arrière-plan inversé */

/* Textes */
--theme-text-primary       /* Texte principal */
--theme-text-secondary     /* Texte secondaire */
--theme-text-tertiary      /* Texte tertiaire */
--theme-text-disabled      /* Texte désactivé */
--theme-text-inverse       /* Texte inversé */

/* Bordures */
--theme-border-primary     /* Bordure principale */
--theme-border-secondary   /* Bordure secondaire */
--theme-border-tertiary    /* Bordure tertiaire */

/* Élévations */
--theme-elevation-shadow   /* Ombre adaptative */
--theme-elevation-overlay  /* Overlay adaptatif */
```

### Variables sémantiques (couleurs d'état)

```css
/* Pour chaque état: primary, secondary, success, warning, error, info */
--semantic-{state}-base     /* Couleur de base */
--semantic-{state}-hover    /* État hover */
--semantic-{state}-active   /* État actif */
--semantic-{state}-subtle   /* Version subtile */
--semantic-{state}-muted    /* Version atténuée */
--semantic-{state}-contrast /* Contraste optimal */
```

## 🔧 Utilisation dans les composants

### CSS simple

```css
.my-component {
  color: var(--theme-text-primary);
  background: var(--theme-surface-primary);
  border: 1px solid var(--theme-border-primary);
}

.my-button {
  background: var(--semantic-primary-base);
  color: var(--semantic-primary-contrast);
}

.my-button:hover {
  background: var(--semantic-primary-hover);
}
```

### Classes utilitaires

```html
<!-- Couleurs qui s'adaptent au thème -->
<div class="text-primary bg-secondary border-primary">
  Contenu adaptatif
</div>

<!-- Couleurs sémantiques -->
<button class="bg-primary text-white hover:bg-primary-hover">
  Bouton principal
</button>

<div class="bg-success-subtle text-success border-success">
  Message de succès
</div>
```

### Vue.js avec CSS Variables

```vue
<template>
  <div class="my-component">
    <h1>Mon composant</h1>
  </div>
</template>

<style scoped>
.my-component {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--theme-surface-secondary);
  color: var(--theme-text-primary);
  transition: var(--duration-normal) ease-in-out;
}
</style>
```

## 🎛️ Composant ThemeToggle

### Props disponibles

```vue
<ThemeToggle 
  size="base"           // 'sm' | 'base' | 'lg'
  variant="subtle"      // 'subtle' | 'outlined' | 'ghost'
  :show-label="false"   // Afficher le texte
/>
```

### Méthodes exposées

```vue
<script setup>
import { ref } from 'vue'

const themeToggle = ref()

// Changer le thème programmatiquement
const switchToDark = () => {
  themeToggle.value.applyTheme('dark')
}

// Accéder au thème actuel
const currentTheme = themeToggle.value.currentTheme
</script>

<template>
  <ThemeToggle ref="themeToggle" />
</template>
```

## 🌍 Gestion automatique

### Détection système

```js
// Le système détecte automatiquement :
// 1. Préférence sauvegardée (localStorage)
// 2. Préférence système (prefers-color-scheme)
// 3. Mode light par défaut

// Écoute les changements système
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleThemeChange)
```

### Stockage persistant

```js
// Sauvegarde automatique dans localStorage
localStorage.setItem('theme', 'dark')

// Récupération au chargement
const savedTheme = localStorage.getItem('theme')
```

## 🎨 Personnalisation

### Modifier les couleurs des thèmes

Éditez `design-system/tokens/themes.json` :

```json
{
  "themes": {
    "dark": {
      "surface": {
        "primary": "gray.900",     // Plus sombre
        "secondary": "gray.800"    // Personnalisé
      }
    }
  }
}
```

### Ajouter un nouveau thème

```json
{
  "themes": {
    "high-contrast": {
      "surface": {
        "primary": "base.black",
        "secondary": "base.white"
      },
      "text": {
        "primary": "base.white",
        "secondary": "base.white"
      }
    }
  }
}
```

### Regénérer les variables

```bash
npm run tokens:build
```

## 📋 Meilleures pratiques

### ✅ **À faire**

- Utiliser les variables de thème pour les couleurs principales
- Tester dans les deux modes lors du développement
- Respecter les contrastes d'accessibilité
- Utiliser les classes utilitaires quand possible

### ❌ **À éviter**

- Couleurs codées en dur dans les composants
- Ignorer les préférences d'accessibilité
- Transitions trop longues ou flashy
- Oublier de tester le mode dark

## 🔍 Debug et développement

### Forcer un thème

```html
<!-- Force le mode dark temporairement -->
<html data-theme="dark">

<!-- Force le mode light -->
<html data-theme="light">
```

### Vérifier les variables

```js
// Dans les DevTools
getComputedStyle(document.documentElement)
  .getPropertyValue('--theme-text-primary')
```

### Classes de debug

```css
/* Voir les variables actuelles */
.debug-theme::after {
  content: 'Theme: ' attr(data-theme);
  background: var(--semantic-info-subtle);
  color: var(--semantic-info-base);
}
```

## 📊 Performance

- **0 JS runtime** pour l'application des thèmes
- **Variables CSS natives** (support IE11+)
- **Transitions optimisées** avec GPU
- **Taille minimale** : +2KB gzippé

## 🎯 Roadmap

- [ ] Support des thèmes personnalisés utilisateur
- [ ] Thème "high contrast" automatique
- [ ] Synchronisation multi-onglets
- [ ] API de thèmes pour les plugins
- [ ] Export des thèmes en formats design (Figma, Sketch)