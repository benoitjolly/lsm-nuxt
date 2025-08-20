# Composant Table

Le composant Table est un tableau agnostique avec formatage automatique selon le type de données.

## Props

- `columns` (Array, required): Configuration des colonnes
- `data` (Array): Données à afficher
- `loading` (Boolean): État de chargement
- `emptyMessage` (String): Message quand aucune donnée
- `rowKey` (String|Function): Clé unique pour chaque ligne

## Configuration des colonnes

Chaque colonne peut avoir les propriétés suivantes :

```javascript
{
  key: 'columnKey',      // Clé pour accéder aux données
  label: 'Libellé',      // Titre de la colonne
  type: 'text',          // Type de formatage (optionnel)
  hidden: 'hidden md:table-cell', // Classes responsive
  cellClass: 'text-center', // Classes CSS pour les cellules
  emptyText: '-',        // Texte si valeur vide
  
  // Options spécifiques selon le type
  dateFormat: 'short',   // Pour type 'date' ou 'datetime'
  currency: 'EUR',       // Pour type 'currency'
  numberFormat: {},      // Pour type 'number'
  trueText: 'Actif',     // Pour type 'boolean'
  falseText: 'Inactif'   // Pour type 'boolean'
}
```

## Types supportés

### Type 'date'
Formate les timestamps en dates.

```javascript
{
  key: 'createdAt',
  label: 'Date de création',
  type: 'date',
  dateFormat: 'short', // 'short' | 'long' | 'relative'
  emptyText: 'Non définie'
}
```

Exemples de rendu :
- `short`: "13 juil. 2025"
- `long`: "13 juillet 2025"
- `relative`: "Il y a 2 jours"

### Type 'datetime'
Formate les timestamps en date et heure.

```javascript
{
  key: 'lastLoginAt',
  label: 'Dernière connexion',
  type: 'datetime',
  dateFormat: 'short', // 'short' | 'long'
  emptyText: 'Jamais'
}
```

Exemples de rendu :
- `short`: "13 juil. 2025 14:26"
- `long`: "13 juillet 2025 14:26:42"

### Type 'number'
Formate les nombres avec Intl.NumberFormat.

```javascript
{
  key: 'score',
  label: 'Score',
  type: 'number',
  numberFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
}
```

### Type 'currency'
Formate les montants en devise.

```javascript
{
  key: 'price',
  label: 'Prix',
  type: 'currency',
  currency: 'EUR' // 'EUR' | 'USD' | etc.
}
```

Rendu : "42,50 €"

### Type 'boolean'
Affiche du texte selon la valeur booléenne.

```javascript
{
  key: 'isActive',
  label: 'Statut',
  type: 'boolean',
  trueText: 'Actif',
  falseText: 'Inactif'
}
```

## Exemple complet

```vue
<template>
  <Table
    :columns="columns"
    :data="users"
    :loading="loading"
    empty-message="Aucun utilisateur trouvé"
    row-key="id"
  >
    <!-- Slot personnalisé pour une colonne -->
    <template #cell-avatar="{ item }">
      <Avatar :src="item.photoURL" />
    </template>
    
    <!-- Slot pour les actions -->
    <template #actions="{ item }">
      <Button @click="edit(item)">Modifier</Button>
    </template>
  </Table>
</template>

<script setup>
const columns = [
  {
    key: 'avatar',
    label: 'Photo'
  },
  {
    key: 'name',
    label: 'Nom'
  },
  {
    key: 'email',
    label: 'Email',
    hidden: 'hidden md:table-cell'
  },
  {
    key: 'lastLoginAt',
    label: 'Dernière connexion',
    type: 'datetime',
    dateFormat: 'relative',
    emptyText: 'Jamais connecté'
  },
  {
    key: 'isActive',
    label: 'Statut',
    type: 'boolean',
    trueText: '✅ Actif',
    falseText: '❌ Inactif'
  }
]
</script>
```

## Slots disponibles

- `cell-{columnKey}`: Personnalise le rendu d'une colonne
- `actions`: Ajoute une colonne d'actions à droite

Chaque slot reçoit :
- `item`: L'objet de données complet
- `value`: La valeur de la cellule
- `index`: L'index de la ligne 