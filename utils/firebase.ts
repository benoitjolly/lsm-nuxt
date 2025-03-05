import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import type { FirebaseApp } from 'firebase/app'
import { useRuntimeConfig } from '#app'

// Initialisation différée de Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

// Fonction pour initialiser Firebase avec la configuration
export function initializeFirebase() {
  if (!app) {
    const config = useRuntimeConfig()
    
    const firebaseConfig = {
      apiKey: config.public.FIREBASE_API_KEY,
      authDomain: config.public.FIREBASE_AUTH_DOMAIN,
      projectId: config.public.FIREBASE_PROJECT_ID,
      storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.public.FIREBASE_APP_ID,
      measurementId: config.public.FIREBASE_MEASUREMENT_ID
    }

    // Initialize Firebase
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
  }
  
  return { app, auth }
}

// Exporter les instances pour un accès facile
export { app, auth } 