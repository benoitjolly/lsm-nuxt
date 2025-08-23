<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header from Design System -->
    <Header />

    <!-- Encart promotionnel au-dessus du main (uniquement sur la page d'accueil) -->
    <div v-if="$route.path === '/'" class="pt-24 sm:pt-0 sm:ml-24 bg-gray-100">
      <div class="px-2 sm:px-4 lg:px-6 mx-2 sm:mx-4 mt-4">
        <HomeEncart
          title="Nouveautés 2025"
          description="Découvrez nos dernières serrures de sécurité renforcée avec technologie biométrique et connectivité intelligente."
          :primary-action="{
            text: 'Voir les nouveautés',
            link: '/type/7P35PwVmVa8qw2hoUHEP',
            icon: true
          }"
          :secondary-action="{
            text: 'En savoir plus',
            onClick: () => console.log('En savoir plus cliqué')
          }"
          icon="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-0 sm:pt-0 sm:ml-24 bg-gray-100">
      <main class="py-6 px-2 sm:px-4 lg:px-6 bg-white rounded-xl mx-2 sm:mx-4 my-4 shadow-md">
        <slot />
      </main>
      
      <!-- Footer from Design System -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { Header, Footer } from '~/design-system/layout/index.js'
import HomeEncart from '~/components/HomeEncart.vue'
</script>

<style>
/* Import des classes CSS générées automatiquement par le design system */
@import '~/design-system/generated-styles.css';
</style>

<style>
html, body {
  background-color: #f3f4f6; /* bg-gray-100 */
  overflow-x: hidden; /* Empêche le scroll horizontal global */
}

#__nuxt {
  background-color: #f3f4f6; /* bg-gray-100 */
  overflow-x: hidden; /* Empêche le scroll horizontal global */
}

/* Empêche tous les débordements horizontaux */
* {
  box-sizing: border-box;
}

*:not(svg):not(path) {
  max-width: 100%;
}
</style> 