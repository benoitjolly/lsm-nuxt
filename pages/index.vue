<template>
  <div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Bienvenue sur LSM App
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Votre tableau de bord personnel
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nom d'utilisateur
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ userName }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Email
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ userEmail }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Dernière connexion
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ lastLoginTime }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Actions rapides
        </h3>
        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h4 class="text-base font-medium text-gray-900">Modifier votre profil</h4>
              <p class="mt-1 text-sm text-gray-500">
                Mettez à jour vos informations personnelles
              </p>
              <div class="mt-3">
                <NuxtLink to="/profile" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Voir le profil
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h4 class="text-base font-medium text-gray-900">Se déconnecter</h4>
              <p class="mt-1 text-sm text-gray-500">
                Déconnectez-vous de votre compte
              </p>
              <div class="mt-3">
                <button @click="handleLogout" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import useAuth from '~/composables/useAuth'

// Définir le middleware d'authentification
definePageMeta({
  middleware: ['auth']
})

const { user, logout } = useAuth()
const router = useRouter()

// Obtenir le nom d'utilisateur (ou email si pas de nom)
const userName = computed(() => {
  if (!user.value) return 'Utilisateur'
  return user.value.displayName || user.value.email?.split('@')[0] || ''
})

// Obtenir l'email de l'utilisateur
const userEmail = computed(() => {
  if (!user.value) return 'Non disponible'
  return user.value.email || ''
})

// Obtenir la date de dernière connexion
const lastLoginTime = computed(() => {
  if (!user.value || !user.value.metadata.lastSignInTime) return 'Inconnue'
  return new Date(user.value.metadata.lastSignInTime).toLocaleString('fr-FR')
})

// Gérer la déconnexion
const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
