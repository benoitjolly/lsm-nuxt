import { getFirestore } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'

export const useFirestore = () => {
  if (process.server) {
    return null
  }
  
  const { db } = initializeFirebase()
  return db
} 