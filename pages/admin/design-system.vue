<template>
  <div class="design-system-page">
    <div class="header-section">
      <Heading level="1">Design System</Heading>
      
      <Card class="intro-card">
        <CardContent class="intro-content">
          <p class="intro-text">
            Cette page présente tous les composants disponibles dans notre design system. 
            Chaque composant est documenté avec ses différentes variantes et propriétés.
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="tabs-section">
      <Tabs v-model="activeTab" :tabs="componentTabs">
      <template #default="{ activeTab }">
        
        <!-- Boutons -->
        <div v-if="activeTab === 'buttons'" class="space-y-8">
          <ComponentSection title="Button" description="Composant bouton avec différentes variantes et tailles">
            <div class="grid gap-4">
              <div class="space-y-4">
                <h4 class="font-semibold text-neutral-700">Variantes</h4>
                <div class="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="login">Login</Button>
                  <Button variant="google">Google</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
              
              <div class="space-y-4">
                <h4 class="font-semibold text-neutral-700">Tailles</h4>
                <div class="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="base">Base</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div class="space-y-4">
                <h4 class="font-semibold text-neutral-700">États</h4>
                <div class="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button full-width class="w-full max-w-xs">Full Width</Button>
                </div>
              </div>
            </div>
          </ComponentSection>
        </div>

        <!-- Formulaires -->
        <div v-if="activeTab === 'forms'" class="space-y-8">
          <ComponentSection title="Input" description="Champs de saisie pour les formulaires">
            <div class="space-y-6 max-w-md">
              <Input label="Nom d'utilisateur" placeholder="Saisissez votre nom" />
              <Input label="Email" type="email" placeholder="votre@email.com" />
              <Input label="Mot de passe" type="password" placeholder="••••••••" />
              <Input label="Champ requis" required placeholder="Ce champ est obligatoire" />
              <Input label="Champ avec erreur" error="Ce champ contient une erreur" />
              <Input label="Champ désactivé" disabled placeholder="Champ désactivé" />
            </div>
          </ComponentSection>

          <ComponentSection title="SearchInput" description="Champ de recherche avec icône">
            <div class="max-w-md">
              <SearchInput placeholder="Rechercher..." />
            </div>
          </ComponentSection>
        </div>

        <!-- Affichage -->
        <div v-if="activeTab === 'display'" class="space-y-8">
          <ComponentSection title="Card & CardContent" description="Conteneurs pour organiser le contenu">
            <div class="grid gap-4 max-w-2xl">
              <Card>
                <CardContent class="p-6">
                  <h3 class="font-semibold mb-2">Titre de la carte</h3>
                  <p class="text-neutral-600">Contenu de la carte avec du texte explicatif.</p>
                </CardContent>
              </Card>
            </div>
          </ComponentSection>

          <ComponentSection title="Alert" description="Messages d'alerte et de notification">
            <div class="space-y-4">
              <Alert variant="info" title="Information" message="Ceci est un message d'information." />
              <Alert variant="success" title="Succès" message="L'opération s'est déroulée avec succès." />
              <Alert variant="warning" title="Attention" message="Veuillez faire attention à cette action." />
              <Alert variant="error" title="Erreur" message="Une erreur s'est produite." />
              <Alert variant="info" title="Avec bouton fermer" message="Cette alerte peut être fermée." dismissible />
            </div>
          </ComponentSection>

          <ComponentSection title="Badge" description="Étiquettes pour marquer le statut ou la catégorie">
            <div class="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </ComponentSection>

          <ComponentSection title="Avatar" description="Images de profil utilisateur">
            <div class="flex flex-wrap items-center gap-4">
              <Avatar size="sm" name="John Doe" />
              <Avatar size="base" name="Jane Smith" />
              <Avatar size="lg" name="Bob Wilson" />
              <Avatar name="Alice Brown" image="https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=100&h=100&fit=crop&crop=face" />
            </div>
          </ComponentSection>
        </div>

        <!-- Navigation -->
        <div v-if="activeTab === 'navigation'" class="space-y-8">
          <ComponentSection title="Tabs" description="Navigation par onglets">
            <Card>
              <CardContent class="p-6">
                <Tabs v-model="demoActiveTab" :tabs="demoTabs">
                  <template #default="{ activeTab }">
                    <div class="mt-4 p-4 bg-neutral-50 rounded">
                      <p v-if="activeTab === 'tab1'">Contenu de l'onglet 1</p>
                      <p v-if="activeTab === 'tab2'">Contenu de l'onglet 2</p>
                      <p v-if="activeTab === 'tab3'">Contenu de l'onglet 3</p>
                    </div>
                  </template>
                </Tabs>
              </CardContent>
            </Card>
          </ComponentSection>



          <ComponentSection title="AuthLink" description="Liens d'authentification stylisés">
            <div class="space-y-2">
              <AuthLink href="/login">Se connecter</AuthLink>
              <AuthLink href="/register">Créer un compte</AuthLink>
              <AuthLink href="/reset-password">Mot de passe oublié ?</AuthLink>
            </div>
          </ComponentSection>
        </div>

        <!-- Structure -->
        <div v-if="activeTab === 'structure'" class="space-y-8">
          <ComponentSection title="Heading" description="Titres de différents niveaux">
            <div class="space-y-4">
              <Heading level="1">Titre niveau 1</Heading>
              <Heading level="2">Titre niveau 2</Heading>
              <Heading level="3">Titre niveau 3</Heading>
              <Heading level="4">Titre niveau 4</Heading>
              <Heading level="5">Titre niveau 5</Heading>
              <Heading level="6">Titre niveau 6</Heading>
            </div>
          </ComponentSection>

          <ComponentSection title="Separator" description="Séparateurs pour diviser le contenu">
            <div class="space-y-6">
              <div>
                <p>Contenu avant le séparateur</p>
                <Separator />
                <p>Contenu après le séparateur</p>
              </div>
              <div>
                <p>Séparateur avec texte</p>
                <Separator text="ou" />
                <p>Contenu après le séparateur avec texte</p>
              </div>
            </div>
          </ComponentSection>

          <ComponentSection title="DescriptionList" description="Listes de descriptions structurées">
            <Card>
              <CardContent class="p-6">
                <DescriptionList>
                  <DescriptionListItem label="Nom" value="John Doe" />
                  <DescriptionListItem label="Email" value="john.doe@example.com" />
                  <DescriptionListItem label="Téléphone" value="+33 1 23 45 67 89" />
                  <DescriptionListItem label="Adresse" value="123 Rue de la Paix, 75001 Paris" />
                </DescriptionList>
              </CardContent>
            </Card>
          </ComponentSection>

          <ComponentSection title="Table" description="Tableaux pour afficher des données">
            <Card>
              <CardContent class="p-6">
                <Table
                  :columns="tableColumns"
                  :data="tableData"
                  searchable
                  :items-per-page="5"
                />
              </CardContent>
            </Card>
          </ComponentSection>
        </div>

        <!-- Modales -->
        <div v-if="activeTab === 'modals'" class="space-y-8">
          <ComponentSection title="Modal" description="Fenêtres modales pour les interactions">
            <div>
              <Button @click="showModal = true">Ouvrir la modale</Button>
              <Modal v-model="showModal" title="Exemple de modale">
                <template #content>
                  <p>Ceci est le contenu de la modale. Vous pouvez y placer n'importe quel contenu.</p>
                </template>
                <template #actions>
                  <Button variant="secondary" @click="showModal = false">Annuler</Button>
                  <Button @click="showModal = false">Confirmer</Button>
                </template>
              </Modal>
            </div>
          </ComponentSection>
        </div>

      </template>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Heading, 
  Card, 
  CardContent, 
  Tabs, 
  Button, 
  Input, 
  SearchInput, 
  Alert, 
  Badge, 
  Avatar, 
  AuthLink, 
  Separator, 
  DescriptionList, 
  DescriptionListItem, 
  Table, 
  Modal
} from '~/design-system/components'

// Définir le middleware d'administration
definePageMeta({
  middleware: ['admin']
})

// État des onglets
const activeTab = ref('buttons')
const demoActiveTab = ref('tab1')
const showModal = ref(false)

// Configuration des onglets
const componentTabs = [
  { id: 'buttons', label: 'Boutons' },
  { id: 'forms', label: 'Formulaires' },
  { id: 'display', label: 'Affichage' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'structure', label: 'Structure' },
  { id: 'modals', label: 'Modales' }
]

const demoTabs = [
  { id: 'tab1', label: 'Onglet 1' },
  { id: 'tab2', label: 'Onglet 2' },
  { id: 'tab3', label: 'Onglet 3' }
]

// Configuration du tableau de démonstration
const tableColumns = [
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rôle', sortable: true },
  { key: 'status', label: 'Statut', sortable: false }
]

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Actif' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Utilisateur', status: 'Actif' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Modérateur', status: 'Inactif' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Utilisateur', status: 'Actif' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', status: 'Actif' }
]
</script>

<script lang="ts">
// Composant pour les sections de documentation
const ComponentSection = {
  props: {
    title: String,
    description: String
  },
  template: `
    <div class="component-section">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-neutral-800 mb-2">{{ title }}</h3>
        <p class="text-neutral-600">{{ description }}</p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-6">
        <slot />
      </div>
    </div>
  `
}

export default {
  components: {
    ComponentSection
  }
}
</script>

<style scoped>
.design-system-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  min-height: 100vh;
  background-color: #fafafa;
}

.header-section {
  margin-bottom: 3rem;
}

.intro-card {
  margin-top: 2rem;
}

.intro-content {
  padding: 2rem;
}

.intro-text {
  color: #6b7280;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
}

.tabs-section {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Espacement des sections de contenu */
.space-y-8 > * + * {
  margin-top: 2.5rem;
}

.space-y-6 > * + * {
  margin-top: 2rem;
}

.space-y-4 > * + * {
  margin-top: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.75rem;
}

/* Layout utilities */
.grid {
  display: grid;
}

.gap-4 {
  gap: 1.5rem;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

/* Width utilities */
.max-w-2xl {
  max-width: 42rem;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-xs {
  max-width: 20rem;
}

.w-full {
  width: 100%;
}

/* Typography utilities */
.font-semibold {
  font-weight: 600;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-neutral-800 {
  color: #1f2937;
}

.text-neutral-700 {
  color: #374151;
}

.text-neutral-600 {
  color: #4b5563;
}

/* Background utilities */
.bg-white {
  background-color: #ffffff;
}

.bg-neutral-50 {
  background-color: #f9fafb;
}

/* Border utilities */
.border {
  border-width: 1px;
}

.border-neutral-200 {
  border-color: #e5e7eb;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

/* Padding utilities */
.p-6 {
  padding: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

/* Margin utilities */
.mt-4 {
  margin-top: 1.5rem;
}

/* Component section styling */
:deep(.component-section) {
  margin-bottom: 3rem;
}

:deep(.component-section:last-child) {
  margin-bottom: 0;
}

:deep(.component-section .bg-white) {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.component-section h3) {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.component-section p) {
  margin-bottom: 2rem;
  color: #6b7280;
  line-height: 1.6;
}
</style>