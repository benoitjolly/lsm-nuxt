# StepperProgress

Un composant stepper agnostique et réutilisable pour afficher la progression d'un processus en plusieurs étapes.

## Fonctionnalités

- ✅ **Agnostique** : Peut être utilisé dans n'importe quel contexte
- ✅ **Responsive** : S'adapte aux différentes tailles d'écran
- ✅ **Accessible** : Navigation au clavier et lecteurs d'écran
- ✅ **Personnalisable** : Différentes tailles et variantes
- ✅ **TypeScript** : Types complets pour une meilleure DX

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `steps` | `Step[]` | **requis** | Tableau des étapes à afficher |
| `showDescriptions` | `boolean` | `true` | Afficher ou masquer les descriptions |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du stepper |
| `variant` | `'default' \| 'minimal'` | `'default'` | Variante d'affichage |

## Interface Step

```typescript
interface Step {
  id: number | string      // Identifiant unique de l'étape
  title: string           // Titre de l'étape
  description?: string    // Description optionnelle
  completed: boolean      // Étape terminée
  current: boolean        // Étape actuelle
}
```

## Utilisation de base

```vue
<template>
  <StepperProgress :steps="steps" />
</template>

<script setup>
import StepperProgress from '~/components/StepperProgress.vue'

const steps = [
  {
    id: 1,
    title: 'Informations',
    description: 'Saisissez vos informations',
    completed: true,
    current: false
  },
  {
    id: 2,
    title: 'Validation',
    description: 'Validez vos données',
    completed: false,
    current: true
  },
  {
    id: 3,
    title: 'Confirmation',
    description: 'Confirmez votre choix',
    completed: false,
    current: false
  }
]
</script>
```

## Variantes

### Sans descriptions
```vue
<StepperProgress :steps="steps" :show-descriptions="false" />
```

### Taille petite
```vue
<StepperProgress :steps="steps" size="sm" />
```

### Taille grande
```vue
<StepperProgress :steps="steps" size="lg" />
```

### Variante minimale
```vue
<StepperProgress :steps="steps" variant="minimal" />
```

## Exemple interactif

```vue
<template>
  <div>
    <StepperProgress :steps="interactiveSteps" />
    
    <div class="mt-4 flex space-x-2">
      <button 
        @click="previousStep" 
        :disabled="currentStep <= 1"
      >
        Précédent
      </button>
      <button 
        @click="nextStep" 
        :disabled="currentStep >= steps.length"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)

const interactiveSteps = computed(() => [
  {
    id: 1,
    title: 'Étape 1',
    description: 'Première étape',
    completed: currentStep.value > 1,
    current: currentStep.value === 1
  },
  {
    id: 2,
    title: 'Étape 2',
    description: 'Deuxième étape',
    completed: currentStep.value > 2,
    current: currentStep.value === 2
  },
  {
    id: 3,
    title: 'Étape 3',
    description: 'Troisième étape',
    completed: currentStep.value > 3,
    current: currentStep.value === 3
  }
])

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const previousStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>
```

## Styles personnalisés

Le composant utilise des classes CSS modulaires que vous pouvez surcharger :

```css
/* Personnaliser les couleurs */
.stepper-circle--current {
  background-color: your-primary-color;
  border-color: your-primary-color;
}

.stepper-line--completed {
  background-color: your-primary-color;
}

.stepper-title--current {
  color: your-primary-color;
}
```

## Responsive

Le composant s'adapte automatiquement :
- **Desktop** : Affichage complet avec descriptions
- **Tablet** : Texte réduit, descriptions conservées
- **Mobile** : Cercles plus petits, descriptions masquées sur très petit écran

## Accessibilité

- Navigation au clavier supportée
- Attributs ARIA appropriés
- Contraste de couleurs respecté
- Support des lecteurs d'écran

## Exemples d'utilisation

- Processus de commande (panier → login → paiement)
- Formulaire multi-étapes
- Processus d'inscription
- Workflow de validation
- Installation/configuration
