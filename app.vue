<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { initializeFirebase } from '~/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useAuth from '~/composables/useAuth'

const { setUser, setAuthenticated } = useAuth()

// Initialiser l'état d'authentification uniquement côté client
onMounted(() => {
  if (process.client) {
    const { auth } = initializeFirebase()
    if (auth) {
      onAuthStateChanged(auth, async (user) => {
        await setUser(user)
        setAuthenticated(!!user)
      })
    }
  }
})
</script>

