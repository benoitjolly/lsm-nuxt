<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-500 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>
        </div>

        <div class="flex items-center justify-center">
          <div class="text-sm">
            <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Retour à la connexion
            </NuxtLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

// Définir cette page comme publique
definePageMeta({
  middleware: [],
  layout: 'auth'
})

const router = useRouter()
const { sendPasswordResetEmail } = useFirebaseAuth()

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleResetPassword = async () => {
  if (!email.value) {
    error.value = 'Veuillez entrer votre email'
    return
  }
  
  try {
    loading.value = true
    error.value = null
    success.value = null
    
    const result = await sendPasswordResetEmail(email.value)
    if (result) {
      success.value = 'Un email de réinitialisation a été envoyé à votre adresse'
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      error.value = 'Une erreur est survenue lors de l\'envoi de l\'email'
    }
  } catch (err: any) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', err)
    error.value = err.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe'
  } finally {
    loading.value = false
  }
}
</script> 