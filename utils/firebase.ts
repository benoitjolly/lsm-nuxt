import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import type { FirebaseApp } from 'firebase/app'
import { useRuntimeConfig } from '#app'

// Initialisation différée de Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Fonction pour initialiser Firebase avec la configuration
export function initializeFirebase() {
  // Ne pas initialiser Firebase côté serveur
  if (process.server) {
    return { app: undefined, auth: undefined, db: undefined, storage: undefined }
  }

  if (!app) {
    try {
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
      db = getFirestore(app)
      storage = getStorage(app)
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Firebase:', error)
    }
  }
  
  return { app, auth, db, storage }
}

// Exporter les instances pour un accès facile
export { app, auth, db, storage } 