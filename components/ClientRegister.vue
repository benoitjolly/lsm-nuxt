<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <Button
            type="submit"
            :disabled="isLoading"
            variant="login"
            size="base"
            fullWidth
          >
            {{ isLoading ? 'Création...' : 'Créer un compte' }}
          </Button>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <AuthLink to="/login">
              Déjà un compte ? Se connecter
            </AuthLink>
          </div>
        </div>

        <Separator>
          Ou continuer avec
        </Separator>

        <div class="mt-6">
          <Button
            type="button"
            @click="handleGoogleLogin"
            :disabled="isLoading"
            variant="google"
            size="base"
            fullWidth
          >
            <template #icon>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 mr-2" />
            </template>
            Google
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { Button, AuthLink, Separator } from '~/design-system/components'

const props = defineProps({
  redirectTo: {
    type: String,
    default: '/'
  }
})

const emit = defineEmits(['register-success', 'register-error'])

const router = useRouter()
const { isLoggedIn } = useAuth()
const { registerWithEmail, signInWithGoogle, error, loading } = useFirebaseAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Rediriger si déjà connecté
onMounted(() => {
  if (isLoggedIn.value) {
    router.push(props.redirectTo)
  }
})

// Surveiller les erreurs Firebase
watch(error, (newError) => {
  if (newError) {
    errorMessage.value = newError
    emit('register-error', newError)
  }
})

const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "Veuillez remplir tous les champs"
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas"
    return
  }
  
  isLoading.value = true
  try {
    const success = await registerWithEmail(email.value, password.value)
    if (success) {
      emit('register-success')
      router.push(props.redirectTo)
    }
  } catch (e) {
    console.error('Erreur d\'inscription:', e)
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  isLoading.value = true
  try {
    const success = await signInWithGoogle()
    if (success) {
      emit('register-success')
      router.push(props.redirectTo)
    }
  } catch (e) {
    console.error('Erreur de connexion Google:', e)
  } finally {
    isLoading.value = false
  }
}
</script> 