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

// Initialiser l'état d'authentification
onMounted(() => {
  const { auth } = initializeFirebase()
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      setAuthenticated(!!user)
    })
  }
})
</script>

