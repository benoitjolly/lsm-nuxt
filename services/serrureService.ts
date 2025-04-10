import { initializeFirebase } from '~/utils/firebase'
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Serrure } from '~/types/serrure'

const COLLECTION_NAME = 'serrures'

export const useSerrureService = () => {
  // Vérifier si nous sommes côté serveur
  if (process.server) {
    // Retourner des implémentations vides pour le rendu SSR
    return {
      addSerrure: async () => "",
      getAllSerrures: async () => [] as Serrure[],
      getSerrureById: async () => null,
      updateSerrure: async () => {},
      deleteSerrure: async () => {},
      searchSerruresByCode: async () => [] as Serrure[],
      uploadPhoto: async () => "",
      uploadPlan: async () => ""
    }
  }

  // Initialiser Firebase uniquement côté client
  const { db, storage } = initializeFirebase()
  
  if (!db || !storage) {
    console.error('Firebase n\'est pas correctement initialisé')
  }

  const addSerrure = async (serrure: Serrure, photoFile?: File, planFile?: File): Promise<string> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), serrure)
      
      if (photoFile) {
        const photoUrl = await uploadPhoto(docRef.id, photoFile)
        await updateDoc(docRef, { photoUrl })
      }
      
      if (planFile) {
        const planUrl = await uploadPlan(docRef.id, planFile)
        await updateDoc(docRef, { planUrl })
      }
      
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la serrure:', error)
      throw error
    }
  }

 
  const uploadPhoto = async (serrureId: string, photoFile: File): Promise<string> => {
    try {
      if (!storage) throw new Error('Firebase Storage n\'est pas initialisé')
      
      const storageRef = ref(storage, `${COLLECTION_NAME}/${serrureId}/photo`)
      await uploadBytes(storageRef, photoFile)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error)
      throw error
    }
  }

  const uploadPlan = async (serrureId: string, planFile: File): Promise<string> => {
    try {
      if (!storage) throw new Error('Firebase Storage n\'est pas initialisé')
      
      const storageRef = ref(storage, `${COLLECTION_NAME}/${serrureId}/plan`)
      await uploadBytes(storageRef, planFile)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Erreur lors du téléchargement du plan:', error)
      throw error
    }
  }
  
  const getAllSerrures = async (): Promise<Serrure[]> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Serrure))
    } catch (error) {
      console.error('Erreur lors de la récupération des serrures:', error)
      throw error
    }
  }

  
  const getSerrureById = async (id: string): Promise<Serrure | null> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Serrure
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de la serrure:', error)
      throw error
    }
  }

  
  const updateSerrure = async (id: string, serrure: Partial<Serrure>, photoFile?: File, planFile?: File): Promise<void> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const docRef = doc(db, COLLECTION_NAME, id)
      
      if (photoFile) {
        const photoUrl = await uploadPhoto(id, photoFile)
        serrure.photoUrl = photoUrl
      }
      
      if (planFile) {
        const planUrl = await uploadPlan(id, planFile)
        serrure.planUrl = planUrl
      }
      
      await updateDoc(docRef, serrure)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la serrure:', error)
      throw error
    }
  }

 
  const deleteSerrure = async (id: string): Promise<void> => {
    try {
      if (!db || !storage) throw new Error('Firebase n\'est pas initialisé')
      
      const serrure = await getSerrureById(id)
      
      if (serrure?.photoUrl) {
        const photoStorageRef = ref(storage, `${COLLECTION_NAME}/${id}/photo`)
        try {
          await deleteObject(photoStorageRef)
        } catch (e) {
          console.warn('Impossible de supprimer la photo', e)
        }
      }
      
      if (serrure?.planUrl) {
        const planStorageRef = ref(storage, `${COLLECTION_NAME}/${id}/plan`)
        try {
          await deleteObject(planStorageRef)
        } catch (e) {
          console.warn('Impossible de supprimer le plan', e)
        }
      }
      
      const docRef = doc(db, COLLECTION_NAME, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erreur lors de la suppression de la serrure:', error)
      throw error
    }
  }

  
  const searchSerruresByCode = async (codeArticle: string): Promise<Serrure[]> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('codeArticle', '==', codeArticle)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Serrure))
    } catch (error) {
      console.error('Erreur lors de la recherche des serrures:', error)
      throw error
    }
  }

  return {
    addSerrure,
    getAllSerrures,
    getSerrureById,
    updateSerrure,
    deleteSerrure,
    searchSerruresByCode,
    uploadPhoto,
    uploadPlan
  }
} 