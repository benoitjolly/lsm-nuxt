// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, // Désactiver le SSR pour gérer l'authentification uniquement côté client
  css: ["~/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-03-03",

  modules: ['@nuxtjs/tailwindcss'],


  routeRules: {
    '/serrure': { swr: true },
    '/serrure/**': { swr: true },

  },
  
  // Configuration des variables d'environnement
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://votredomaine.com',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Serrures Professionnelles',
      twitterHandle: process.env.NUXT_PUBLIC_TWITTER_HANDLE || '@votre_compte_twitter',
      googleVerification: process.env.NUXT_PUBLIC_GOOGLE_VERIFICATION || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    }
  },
  
  app: {
    head: {
      title: 'LSM App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'LSM Application' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
});