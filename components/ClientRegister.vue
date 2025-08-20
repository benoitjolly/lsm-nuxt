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
          Créer un compte
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <Input
            v-model="email"
            name="email"
            type="email"
            placeholder="Email"
            variant="rounded-top"
            required
          />
          <Input
            v-model="password"
            name="password"
            type="password"
            placeholder="Mot de passe"
            variant="no-rounded"
            required
          />
          <Input
            v-model="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            variant="rounded-bottom"
            required
          />
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
import { Button, AuthLink, Separator, Input } from '~/design-system/components'

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