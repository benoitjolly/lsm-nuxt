<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <!-- Logo LSM avec coins arrondis -->
        <div class="flex justify-center mb-6">
          <NuxtLink to="/">
            <img 
              src="~/assets/images/logo.png" 
              alt="LSM Logo" 
              class="w-16 h-16 rounded-xl bg-white shadow-md p-2 cursor-pointer hover:shadow-lg transition-shadow"
            />
          </NuxtLink>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm -space-y-px">
          <Input
            v-model="email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-500 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <Button
            type="submit"
            :disabled="loading"
            variant="login"
            size="base"
            fullWidth
          >
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </Button>
        </div>

        <div class="flex items-center justify-center">
          <div class="text-sm">
            <AuthLink to="/login">
              Retour à la connexion
            </AuthLink>
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
import { Button, AuthLink, Input } from '~/design-system/components'

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