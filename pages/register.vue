<template>
  <ClientOnly>
    <ClientRegister @register-success="onRegisterSuccess" />
    
    <template #fallback>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p class="mt-4 text-center text-gray-600">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: [],
  layout: 'auth'
})

const router = useRouter()

const onRegisterSuccess = () => {
  // Éventuelles actions supplémentaires après l'inscription réussie
  console.log('Inscription réussie')
}
</script> 