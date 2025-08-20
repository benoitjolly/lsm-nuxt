# 🎨 Design Tokens System

Un système de tokens de design complet avec génération automatique de variables CSS.

## 📁 Structure

```
design-system/tokens/
├── colors.json          # Palette de couleurs complète
├── spacing.json         # Espacements et tokens sémantiques
├── typography.json      # Typographie et styles de texte
├── effects.json         # Ombres, bordures, transitions
└── index.js            # Résoluteur et export des tokens
```

## 🔧 Utilisation

### Générer les variables CSS

```bash
npm run tokens:build
```

Cette commande génère :
- `design-system/css-variables.css` - Variables CSS à importer
- `design-system/css-variables.js` - Variables pour JavaScript

### Dans votre CSS

```css
@import url('./design-system/css-variables.css');

.my-component {
  color: var(--color-primary-base);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
}
```

### Dans JavaScript/Vue

```js
import { cssVars, getCSSVar } from './design-system/css-variables.js'

// Utiliser les variables
const primaryColor = getCSSVar('--color-primary-base')

// Ou directement les valeurs
const primaryColorValue = cssVars['--color-primary-base']
```

### Classes utilitaires automatiques

Le système génère automatiquement des classes CSS :

```css
/* Couleurs de texte */
.text-primary, .text-secondary, .text-accent, etc.

/* Arrière-plans */
.bg-primary, .bg-secondary, .bg-success, etc.

/* Bordures */
.border-primary, .border-accent, .border-error, etc.

/* Typographie sémantique */
.text-hero, .text-h1, .text-h2, .text-body-base, etc.

/* Espacements */
.space-sm, .p-md, .m-lg, etc.

/* Élévations */
.elevation-card, .elevation-modal, etc.
```

## 🎨 Couleurs disponibles

### Couleurs de base
- **Gray** : 50-950 (neutral principal)
- **Blue** : 50-950 (informations)
- **Indigo** : 50-950 (primaire)
- **Purple** : 50-950 (accent)
- **Green** : 50-950 (succès)
- **Yellow** : 50-950 (attention)
- **Orange** : 50-950 (actions secondaires)
- **Red** : 50-950 (erreurs)
- **Teal** : 50-950 (complémentaire)

### Couleurs sémantiques
- `primary`, `secondary`, `success`, `warning`, `error`, `info`
- Chaque couleur a ses variantes : `base`, `hover`, `active`, `subtle`, `muted`

## 📏 Espacements

### Échelle de base
- `0` à `96` (0rem à 24rem)
- Progression cohérente avec le golden ratio

### Espacements sémantiques
- `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- `section`, `page`, `container` pour les layouts

## ✏️ Typographie

### Tailles de police
- `xs` (12px) à `9xl` (128px)

### Styles sémantiques
- **Headings** : `hero`, `h1` à `h6`
- **Body** : `large`, `base`, `small`
- **Labels** : `large`, `base`, `small`
- **Utilitaires** : `caption`, `overline`

## 🎭 Effets

### Ombres
- `none`, `xs`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `inner`
- Élévations sémantiques : `subtle`, `card`, `raised`, `floating`, `modal`, `dropdown`, `overlay`

### Bordures
- **Largeurs** : `0`, `default`, `2`, `4`, `8`
- **Rayons** : `none`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`

### Transitions
- **Durées** : `75ms` à `1000ms`
- **Timing** : `linear`, `in`, `out`, `inOut`
- **Propriétés** : `none`, `all`, `colors`, `opacity`, `shadow`, `transform`

## 🔄 Workflow de développement

1. **Modifier les tokens** dans les fichiers JSON
2. **Regénérer** : `npm run tokens:build`
3. **Utiliser** les nouvelles variables dans le code
4. **Commiter** les fichiers générés

## 📊 Variables générées

Le système génère actuellement **290+ variables CSS** couvrant :
- 🎨 Couleurs (base + sémantiques)
- 📏 Espacements
- ✏️ Typographie
- 🎭 Effets visuels

## 🔧 Maintenance

### Ajouter une nouvelle couleur

1. Ajouter dans `colors.json` :
```json
{
  "colors": {
    "pink": {
      "50": "#fdf2f8",
      "500": "#ec4899",
      "900": "#831843"
    }
  }
}
```

2. Regénérer : `npm run tokens:build`

### Référencer une couleur existante

```json
{
  "semantic": {
    "brand": {
      "primary": "pink.500",
      "subtle": "pink.50"
    }
  }
}
```

## 🚀 Intégration

Le système est conçu pour s'intégrer parfaitement avec :
- **Tailwind CSS** (remplacement progressif)
- **Vue 3** (CSS variables dans style)
- **CSS-in-JS** (via le fichier JavaScript)
- **Design Systems** existants

## 📝 Notes techniques

- **Résolution automatique** des références de tokens
- **Détection des références circulaires**
- **Classes utilitaires** générées automatiquement
- **Type safety** avec TypeScript (à venir)
- **Performance optimisée** avec CSS custom properties