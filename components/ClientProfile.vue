<template>
  <div>
    <Heading level="1" class="mb-6">Mon Profil</Heading>
    
    <Card class="mb-6">
      <template #header>
        <Heading level="3">
          Informations personnelles
        </Heading>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Détails de votre compte
        </p>
      </template>
      
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <DescriptionList>
          <DescriptionListItem 
            label="Nom d'utilisateur" 
            :value="userName" 
          />
          <DescriptionListItem 
            label="Email" 
            :value="userEmail" 
          />
          <DescriptionListItem 
            label="Dernière connexion" 
            :value="lastLoginTime" 
          />
        </DescriptionList>
      </div>
    </Card>

    <Card>
      <template #header>
        <Heading level="3">
          Actions du compte
        </Heading>
        <div class="mt-5">
          <Button 
            @click="handleLogout" 
            variant="danger"
            size="base"
          >
            Déconnexion
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'
import { Button, Card, Heading, DescriptionList, DescriptionListItem } from '~/design-system/components'

const emit = defineEmits(['logout'])

const { user, logout, isLoggedIn } = useAuth()
const router = useRouter()

// Vérifier l'authentification au montage
onMounted(() => {
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isLoggedIn.value) {
    router.push('/login')
  }
})

const userName = computed(() => {
  if (!user.value) return 'Utilisateur'
  return user.value.displayName || user.value.email?.split('@')[0] || ''
})

const userEmail = computed(() => {
  if (!user.value) return 'Non disponible'
  return user.value.email || ''
})

const lastLoginTime = computed(() => {
  if (!user.value || !user.value.metadata?.lastSignInTime) return 'Inconnue'
  return new Date(user.value.metadata.lastSignInTime).toLocaleString('fr-FR')
})

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    emit('logout')
    router.push('/login')
  }
}
</script> 