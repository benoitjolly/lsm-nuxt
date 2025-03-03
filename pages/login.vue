<template>
  <div class="min-h-screen flex">
    <!-- Section gauche avec l'image -->
    <div class="hidden lg:flex lg:w-1/2 bg-purple-900 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-purple-800/50 to-purple-900/80"></div>
      <div class="absolute bottom-20 left-10 text-white">
        <h2 class="text-4xl font-bold mb-4">Capturing Moments,<br>Creating Memories</h2>
        <div class="flex gap-2 mt-8">
          <div class="w-8 h-2 bg-gray-400 rounded-full"></div>
          <div class="w-8 h-2 bg-gray-400 rounded-full"></div>
          <div class="w-8 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Section droite avec le formulaire -->
    <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
      <div class="max-w-md w-full mx-auto">
        <div class="flex justify-between items-center mb-8">
          <img src="/logo.svg" alt="Logo" class="h-8" />
          <NuxtLink to="/" class="text-gray-600 hover:text-purple-600">
            Back to website →
          </NuxtLink>
        </div>

        <h1 class="text-4xl font-bold mb-2">Create an account</h1>
        <p class="text-gray-600 mb-8">
          Already have an account?
          <NuxtLink to="/signin" class="text-purple-600 hover:underline">Log in</NuxtLink>
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First name"
                class="w-full p-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>
            <div>
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last name"
                class="w-full p-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>
          </div>

          <div>
            <input
              v-model="form.company"
              type="text"
              placeholder="Company"
              class="w-full p-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
              required
            />
          </div>

          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full p-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
              required
            />
          </div>

          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full p-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.terms"
              type="checkbox"
              id="terms"
              class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              required
            />
            <label for="terms" class="ml-2 text-gray-600">
              I agree to the
              <a href="#" class="text-purple-600 hover:underline">Terms & Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            class="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or register with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <button
              @click="signInWithGoogle"
              class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <img src="/google.svg" alt="Google" class="h-5 w-5 mr-2" />
              Google
            </button>
            <button
              class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <img src="/apple.svg" alt="Apple" class="h-5 w-5 mr-2" />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

const { registerWithEmail, signInWithGoogle, loading, error } = useFirebaseAuth()

const showPassword = ref(false)
const form = ref({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  password: '',
  terms: false
})

const handleSubmit = async () => {
  if (!form.value.terms) {
    alert('Please accept the terms and conditions')
    return
  }

  try {
    await registerWithEmail(form.value.email, form.value.password)
    // Rediriger vers la page d'accueil ou le tableau de bord
    navigateTo('/')
  } catch (err) {
    console.error(err)
  }
}
</script> 