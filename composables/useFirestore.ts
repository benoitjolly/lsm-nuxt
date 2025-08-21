import { getFirestore, type Firestore } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'

export const useFirestore = () => {
  if (typeof window === 'undefined') {
    return { db: null as Firestore | null }
  }
  
  const { db } = initializeFirebase()
  return { db: db || null }
} 