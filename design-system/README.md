# Design System LSM

Un design system complet basé sur des tokens sémantiques pour une approche professionnelle et maintenable.

## 🤖 Génération automatique des classes

Les classes CSS sont **générées automatiquement** à partir des tokens définis dans `tokens.js`.

### Comment ça marche

1. **Tokens source** (`design-system/tokens.js`) : Définition des tokens sémantiques
2. **Script générateur** (`design-system/generate-styles.js`) : Lit les tokens et génère le CSS
3. **CSS généré** (`design-system/generated-styles.css`) : Fichier CSS prêt à l'emploi

### Commandes disponibles

```bash
# Génération ponctuelle des styles
npm run build:design-system

# Surveillance et régénération automatique
npm run watch:design-system
```

### Exemple de génération

**Token défini dans `tokens.js`** :
```javascript
typography: {
  styles: {
    'heading-2xl': {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.25',
      fontFamily: 'Inter, system-ui, sans-serif',
    }
  }
}
```

**Classe CSS générée automatiquement** :
```css
.text-heading-2xl {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  font-family: Inter, system-ui, sans-serif;
}
```

## 🎯 Philosophie

Ce design system utilise des **tokens sémantiques** qui combinent les propriétés CSS de base en tokens prêts à l'emploi, évitant la répétition et assurant la cohérence.

### Avant (problématique)
```css
/* Répétition sur chaque composant */
.mon-titre {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  font-family: Inter, system-ui, sans-serif;
}

.mon-autre-titre {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  font-family: Inter, system-ui, sans-serif;
}
```

### Après (solution)
```css
/* Un seul token sémantique - généré automatiquement */
.text-heading-2xl {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  font-family: Inter, system-ui, sans-serif;
}
```

## 📚 Utilisation

### 1. Import du CSS généré

```html
<!-- Dans votre layout ou app.vue -->
<style>
@import '~/design-system/generated-styles.css';
</style>
```

### 2. Classes CSS utilitaires

```html
<!-- Typographie générée automatiquement -->
<h1 class="text-heading-4xl">Titre principal</h1>
<h2 class="text-heading-2xl">Sous-titre</h2>
<p class="text-body-base">Texte de paragraphe</p>
<span class="text-caption">Texte d'aide</span>

<!-- Couleurs générées automatiquement -->
<p class="text-primary">Texte principal</p>
<p class="text-secondary">Texte secondaire</p>
<p class="text-accent">Texte d'accent</p>

<!-- Arrière-plans générés automatiquement -->
<div class="bg-surface-primary">Surface principale</div>
<div class="bg-surface-accent-subtle">Surface d'accent subtile</div>

<!-- Boutons générés automatiquement -->
<button class="button-primary">Action principale</button>
<button class="button-secondary">Action secondaire</button>

<!-- Éléments interactifs générés automatiquement -->
<div class="interactive-secondary">Élément cliquable</div>
```

### 3. Composants Vue avec v-bind

```vue
<template>
  <div class="card">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<script setup>
import { designTokens } from '~/design-system'
</script>

<style scoped>
.card {
  background-color: v-bind('designTokens.colors.semantic["surface-primary"]');
  border: 1px solid v-bind('designTokens.colors.semantic["border-primary"]');
  border-radius: v-bind('designTokens.borders.radius.lg');
  padding: v-bind('designTokens.spacing[6]');
}

.card-title {
  font-size: v-bind('designTokens.typography.styles["heading-lg"].fontSize');
  font-weight: v-bind('designTokens.typography.styles["heading-lg"].fontWeight');
  color: v-bind('designTokens.colors.semantic["text-primary"]');
}

.card-content {
  font-size: v-bind('designTokens.typography.styles["body-base"].fontSize');
  color: v-bind('designTokens.colors.semantic["text-secondary"]');
}
</style>
```

## 🔄 Workflow de développement

### Développement avec surveillance automatique

```bash
# Terminal 1 : Démarrer l'application
npm run dev

# Terminal 2 : Surveillance du design system
npm run watch:design-system
```

Maintenant, chaque fois que vous modifiez `design-system/tokens.js`, les classes CSS sont automatiquement régénérées !

### Ajouter un nouveau token

1. **Modifiez `design-system/tokens.js`** :
```javascript
typography: {
  styles: {
    // Nouveau style ajouté
    'heading-custom': {
      fontSize: '2rem',
      fontWeight: '800',
      lineHeight: '1.2',
      fontFamily: 'Inter, system-ui, sans-serif',
    }
  }
}
```

2. **Le CSS est généré automatiquement** :
```css
.text-heading-custom {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  font-family: Inter, system-ui, sans-serif;
}
```

3. **Utilisez immédiatement la nouvelle classe** :
```html
<h1 class="text-heading-custom">Mon titre personnalisé</h1>
```

## 🎨 Tokens disponibles

### Typographie (générée automatiquement)

| Token | Usage | CSS généré |
|-------|-------|------------|
| `text-heading-4xl` | Titres héros (36px, bold) | `.text-heading-4xl` |
| `text-heading-3xl` | Titres principaux (30px, bold) | `.text-heading-3xl` |
| `text-heading-2xl` | Titres de pages (24px, semibold) | `.text-heading-2xl` |
| `text-heading-xl` | Titres de sections (20px, semibold) | `.text-heading-xl` |
| `text-heading-lg` | Sous-titres (18px, semibold) | `.text-heading-lg` |
| `text-body-lg` | Texte large (18px, normal) | `.text-body-lg` |
| `text-body-base` | Texte par défaut (16px, normal) | `.text-body-base` |
| `text-body-sm` | Texte petit (14px, normal) | `.text-body-sm` |
| `text-label-lg` | Labels larges (16px, medium) | `.text-label-lg` |
| `text-label-base` | Labels (14px, medium) | `.text-label-base` |
| `text-label-sm` | Labels petits (12px, medium) | `.text-label-sm` |
| `text-caption` | Textes d'aide (12px, normal) | `.text-caption` |
| `text-overline` | Textes soulignés (12px, medium, uppercase) | `.text-overline` |

### Couleurs de texte (générées automatiquement)

| Token | Usage | CSS généré |
|-------|-------|------------|
| `text-primary` | Texte principal | `.text-primary` |
| `text-secondary` | Texte secondaire | `.text-secondary` |
| `text-tertiary` | Texte tertiaire | `.text-tertiary` |
| `text-disabled` | Texte désactivé | `.text-disabled` |
| `text-inverse` | Texte inversé (blanc) | `.text-inverse` |
| `text-accent` | Texte d'accent (primaire) | `.text-accent` |
| `text-success` | Texte de succès | `.text-success` |
| `text-warning` | Texte d'alerte | `.text-warning` |
| `text-error` | Texte d'erreur | `.text-error` |

### Arrière-plans (générés automatiquement)

| Token | Usage | CSS généré |
|-------|-------|------------|
| `bg-surface-primary` | Surface principale (blanc) | `.bg-surface-primary` |
| `bg-surface-secondary` | Surface secondaire (gris très clair) | `.bg-surface-secondary` |
| `bg-surface-tertiary` | Surface tertiaire (gris clair) | `.bg-surface-tertiary` |
| `bg-surface-accent` | Surface d'accent (primaire) | `.bg-surface-accent` |
| `bg-surface-accent-subtle` | Surface d'accent subtile | `.bg-surface-accent-subtle` |
| `bg-surface-success` | Surface de succès | `.bg-surface-success` |
| `bg-surface-success-subtle` | Surface de succès subtile | `.bg-surface-success-subtle` |
| `bg-surface-warning` | Surface d'alerte | `.bg-surface-warning` |
| `bg-surface-warning-subtle` | Surface d'alerte subtile | `.bg-surface-warning-subtle` |
| `bg-surface-error` | Surface d'erreur | `.bg-surface-error` |
| `bg-surface-error-subtle` | Surface d'erreur subtile | `.bg-surface-error-subtle` |

### Éléments interactifs (générés automatiquement)

| Token | Usage | CSS généré |
|-------|-------|------------|
| `interactive-primary` | Éléments interactifs principaux | `.interactive-primary` |
| `interactive-secondary` | Éléments interactifs secondaires | `.interactive-secondary` |
| `button-primary` | Boutons d'action principale | `.button-primary` |
| `button-secondary` | Boutons d'action secondaire | `.button-secondary` |

## 🏗️ Architecture

```
design-system/
├── tokens.js              # 📝 Définition des tokens (source)
├── generate-styles.js     # 🤖 Script de génération CSS
├── watch-and-build.js     # 👀 Script de surveillance
├── generated-styles.css   # 🎨 CSS généré automatiquement
├── index.js               # 📦 Point d'entrée principal
├── layout/                # 🧩 Composants de layout
│   ├── index.js           
│   ├── Header.vue         
│   └── Footer.vue         
└── README.md              # 📖 Documentation
```

## 📈 Avantages de la génération automatique

✅ **Consistance garantie** : Impossible d'avoir des valeurs différentes
✅ **Maintenance simplifiée** : Un seul endroit à modifier (tokens.js)
✅ **Performance optimisée** : CSS généré optimisé et minifié
✅ **Développement accéléré** : Surveillance automatique des changements
✅ **Erreurs réduites** : Pas de copier-coller manuel de valeurs
✅ **Documentation auto** : Les classes sont auto-documentées

## 🚀 Utilisation dans les composants existants

Pour migrer un composant existant :

1. **Identifiez les styles répétés**
2. **Remplacez par les classes générées automatiquement**
3. **Si besoin, ajoutez de nouveaux tokens dans `tokens.js`**

### Exemple de migration

```vue
<!-- Avant -->
<template>
  <h2 class="text-2xl font-semibold text-gray-900">{{ title }}</h2>
</template>

<!-- Après -->
<template>
  <h2 class="text-heading-2xl text-primary">{{ title }}</h2>
</template>
```

### Flux de développement optimal

1. 🚀 **Démarrez la surveillance** : `npm run watch:design-system`
2. 📝 **Modifiez les tokens** dans `tokens.js`
3. 🤖 **Le CSS se régénère automatiquement**
4. 🎨 **Utilisez les nouvelles classes** dans vos composants
5. 🔄 **Répétez** le processus

Ce design system vous permet d'avoir un code plus propre, plus maintenable et plus cohérent, avec une génération automatique qui élimine les erreurs humaines ! 🎉 