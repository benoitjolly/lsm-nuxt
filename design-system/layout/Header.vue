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
      

      
      <!-- Paramètres (visible pour les modérateurs et administrateurs) -->
      <ClientOnly>
        <NuxtLink 
          v-if="isModerator" 
          to="/admin/settings" 
          class="nav-link" 
          :class="{ 'nav-link-active': $route.path.startsWith('/admin/settings') }"
          title="Paramètres"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.570.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348L13.928 3.817c-.151-.904-.933-1.567-1.85-1.567h-1.844zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </ClientOnly>
    </nav>
    
    <!-- Menu utilisateur -->
    <div class="user-menu">
      <!-- Panier -->
      <NuxtLink 
        to="/panier" 
        class="nav-link cart-link" 
        :class="{ 'nav-link-active': $route.path === '/panier' }"
        title="Mon panier"
      >
        <div class="cart-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          <ClientOnly>
            <div v-if="itemCount > 0" class="cart-badge" :class="{ 'cart-badge-animate': isAnimating }">
              <span>{{ itemCount }}</span>
            </div>
          </ClientOnly>
        </div>
      </NuxtLink>
      
      <!-- Profil utilisateur -->
      <NuxtLink 
        :to="isLoggedIn ? '/profile' : '/login'" 
        class="nav-link" 
        :class="{ 'nav-link-active': $route.path === '/profile' || $route.path === '/login' }"
        :title="isLoggedIn ? 'Profil utilisateur' : 'Se connecter'"
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
import useCart from '~/composables/useCart'
import { useCartAnimation } from '~/composables/useCartAnimation'
import { designTokens } from '~/design-system/tokens.js'

const router = useRouter()
const { isAdmin, isModerator, isLoggedIn } = useAuth()
const { itemCount } = useCart()
const { isAnimating, triggerAnimation } = useCartAnimation()

// Exposer les fonctions d'animation globalement
if (typeof window !== 'undefined') {
  window.triggerCartAnimation = () => {
    console.log('🎬 Animation déclenchée!')
    triggerAnimation()
  }
}
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
  overflow: visible; /* Permettre au badge de déborder */
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

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Permettre au badge de déborder */
}

.cart-badge {
  position: absolute;
  top: -1rem; /* -px - plus en haut */
  left: 1rem; /* -4px - à gauche au lieu de droite */
  background-color: #4f46e5; /* blue-500 - background bleu */
  color: white; /* texte blanc */
  font-size: 0.625rem; /* 10px */
  font-weight: v-bind('designTokens.typography.fontWeight.bold');
  border-radius: 0.625rem; /* 10px - border radius fixe pour forme ovale */
  height: 1.25rem; /* 20px - hauteur fixe */
  display: inline-flex; /* inline-flex pour s'adapter au contenu */
  align-items: center;
  justify-content: center;
  border: 2px solid white; /* bordure blanche pour contraste */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* ombre légère */
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  width: max-content; /* Largeur qui s'adapte au contenu */
  min-width: 1.25rem; /* Largeur minimale pour les petits nombres */
}

.cart-badge span {
  white-space: nowrap; /* Empêcher le retour à la ligne */
  line-height: 1.25rem; /* Même hauteur que le conteneur pour centrer verticalement */
  padding: 0 0.375rem; /* 6px - padding horizontal */
  text-align: center;
  display: block;
  padding: 0;
}

.cart-badge-animate {
  animation: cartBadgePulse 0.6s ease-in-out;
}

@keyframes cartBadgePulse {
  0% {
    transform: scaleX(1) scaleY(1);
    background-color: #4f46e5;
  }
  25% {
    transform: scaleX(2.8) scaleY(2.4);
    background-color: #7c3aed;
  }
  50% {
    transform: scaleX(2.6) scaleY(2.3);
    background-color: #8b5cf6;
  }
  75% {
    transform: scaleX(2.3) scaleY(2.15);
    background-color: #7c3aed;
  }
  100% {
    transform: scaleX(1) scaleY(1);
    background-color: #4f46e5;
  }
}
</style> 