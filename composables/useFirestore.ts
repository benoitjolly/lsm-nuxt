import { getFirestore } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'

export const useFirestore = () => {
  initializeFirebase()
  return getFirestore()
} 