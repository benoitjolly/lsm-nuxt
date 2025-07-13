<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header from Design System -->
    <Header />

    <!-- Main Content -->
    <div class="pt-24 sm:pt-0 sm:ml-24 bg-gray-100 flex-1 flex flex-col">
      <main class="py-6 px-4 sm:px-6 lg:px-8 flex-1 bg-white rounded-xl mx-4 my-4 shadow-md">
        <slot />
      </main>
      
      <!-- Footer from Design System -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { Header, Footer } from '~/design-system/layout/index.js'
</script>

<style>
/* Import des classes CSS générées automatiquement par le design system */
@import '~/design-system/generated-styles.css';
</style>

<style>
html, body {
  background-color: #f3f4f6; /* bg-gray-100 */
  min-height: 100%;
  height: 100%;
}

#__nuxt {
  height: 100%;
  min-height: 100vh;
  background-color: #f3f4f6; /* bg-gray-100 */
}
</style> 