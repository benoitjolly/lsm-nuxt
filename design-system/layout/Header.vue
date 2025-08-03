<template>
  <header class="header-container">
    <!-- Logo -->
    <div class="logo-container">
      <NuxtLink to="/" class="logo-link">
        <div class="logo-wrapper">
          <img src="~/assets/images/logo.png" alt="LSM Logo" class="logo-image" />
        </div>
      </NuxtLink>
    </div>
    
    <!-- Navigation principale -->
    <nav class="nav-container">
      <!-- Accueil -->
      <NuxtLink 
        to="/" 
        class="nav-link" 
        :class="{ 'nav-link-active': $route.path === '/' }"
        title="Accueil"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      </NuxtLink>
      
      <!-- Serrures (visible pour les modérateurs) -->
      <ClientOnly>
        <NuxtLink 
          v-if="isModerator" 
          to="/serrure" 
          class="nav-link" 
          :class="{ 'nav-link-active': $route.path === '/serrure' }"
          title="Gestion des serrures"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </ClientOnly>
    </nav>
    
    <!-- Menu utilisateur -->
    <div class="user-menu">
      <!-- Toggle de thème -->
      <ThemeToggle size="base" variant="subtle" />
      
      <!-- Profil utilisateur -->
      <NuxtLink 
        to="/profile" 
        class="nav-link" 
        :class="{ 'nav-link-active': $route.path === '/profile' }"
        title="Profil utilisateur"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437.695z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>
      
      <!-- Administration (visible pour les administrateurs) -->
      <ClientOnly>
        <NuxtLink 
          v-if="isAdmin" 
          to="/admin/users" 
          class="nav-link admin-link" 
          :class="{ 'nav-link-active': $route.path === '/admin/users' }"
          title="Administration des utilisateurs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon admin-icon">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
        </NuxtLink>
        
        <!-- Design System (visible pour les administrateurs) -->
        <NuxtLink 
          v-if="isAdmin" 
          to="/admin/design-system" 
          class="nav-link admin-link" 
          :class="{ 'nav-link-active': $route.path === '/admin/design-system' }"
          title="Design System"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon admin-icon">
            <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
        </NuxtLink>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAuth from '~/composables/useAuth'
import { designTokens } from '~/design-system/tokens.js'
import { ThemeToggle } from '~/design-system/components'

const router = useRouter()
const { isAdmin, isModerator } = useAuth()
</script>

<style scoped>
.header-container {
  background-color: v-bind('designTokens.colors.semantic["surface-primary"]');
  box-shadow: v-bind('designTokens.shadows.md');
  position: fixed;
  border-radius: v-bind('designTokens.borders.radius.xl');
  z-index: v-bind('designTokens.zIndex[10]');
  width: 100%;
  height: 5rem; /* 80px */
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: v-bind('designTokens.spacing[2]') v-bind('designTokens.spacing[4]');
}

@media (min-width: 640px) {
  .header-container {
    width: 5rem; /* 80px */
    min-height: calc(100% - 2.5rem); /* 40px */
    margin: v-bind('designTokens.spacing[4]');
    flex-direction: column;
  }
}

.logo-container {
  margin-top: 0;
}

@media (min-width: 640px) {
  .logo-container {
    margin-bottom: v-bind('designTokens.spacing[8]');
    margin-top: 0;
  }
}

.logo-link {
  display: block;
  padding: v-bind('designTokens.spacing[1]');
  border-radius: v-bind('designTokens.borders.radius.md');
  border: v-bind('designTokens.borders.width.DEFAULT') solid v-bind('designTokens.colors.semantic["border-primary"]');
  background-color: v-bind('designTokens.colors.semantic["interactive-secondary"]');
  transition: v-bind('designTokens.transitions.property.colors') v-bind('designTokens.transitions.duration[150]') v-bind('designTokens.transitions.timing.inOut');
}

.logo-link:hover {
  background-color: v-bind('designTokens.colors.semantic["interactive-secondary-hover"]');
}

.logo-wrapper {
  width: 2.5rem; /* 40px */
  height: 2.5rem; /* 40px */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100%;
  height: auto;
  border-radius: v-bind('designTokens.borders.radius.md');
}

.nav-container {
  display: flex;
  flex-direction: row;
  gap: v-bind('designTokens.spacing[4]');
}

@media (min-width: 640px) {
  .nav-container {
    flex-direction: column;
    gap: v-bind('designTokens.spacing[4]');
  }
}

.nav-link {
  padding: v-bind('designTokens.spacing[2]');
  border-radius: v-bind('designTokens.borders.radius.md');
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem; /* 36px */
  height: 2.25rem; /* 36px */
  background-color: v-bind('designTokens.colors.semantic["interactive-secondary"]');
  transition: v-bind('designTokens.transitions.property.colors') v-bind('designTokens.transitions.duration[150]') v-bind('designTokens.transitions.timing.inOut');
}

.nav-link:hover {
  background-color: v-bind('designTokens.colors.semantic["interactive-secondary-hover"]');
}

.nav-link-active {
  background-color: v-bind('designTokens.colors.semantic["interactive-secondary-active"]');
}

.nav-icon {
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  color: v-bind('designTokens.colors.semantic["text-secondary"]');
}

.admin-icon {
  color: v-bind('designTokens.colors.semantic["text-accent"]');
}

.user-menu {
  display: flex;
  flex-direction: row;
  gap: v-bind('designTokens.spacing[2]');
}

@media (min-width: 640px) {
  .user-menu {
    margin-top: auto;
    flex-direction: column;
    gap: v-bind('designTokens.spacing[2]');
  }
}
</style> 