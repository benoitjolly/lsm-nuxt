import { db, storage } from '~/utils/firebase'
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Serrure } from '~/types/serrure'

const COLLECTION_NAME = 'serrures'

export const useSerrureService = () => {
  /**
   * Ajoute une nouvelle serrure avec une photo optionnelle
   */
  const addSerrure = async (serrure: Serrure, photoFile?: File): Promise<string> => {
    try {
      // Ajouter d'abord le document sans l'URL de la photo
      const docRef = await addDoc(collection(db!, COLLECTION_NAME), serrure)
      
      // Si une photo est fournie, la télécharger et mettre à jour le document
      if (photoFile) {
        const photoUrl = await uploadPhoto(docRef.id, photoFile)
        await updateDoc(docRef, { photoUrl })
      }
      
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la serrure:', error)
      throw error
    }
  }

  /**
   * Télécharge une photo vers Firebase Storage
   */
  const uploadPhoto = async (serrureId: string, photoFile: File): Promise<string> => {
    try {
      const storageRef = ref(storage!, `${COLLECTION_NAME}/${serrureId}`)
      await uploadBytes(storageRef, photoFile)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error)
      throw error
    }
  }

  /**
   * Récupère toutes les serrures
   */
  const getAllSerrures = async (): Promise<Serrure[]> => {
    try {
      const querySnapshot = await getDocs(collection(db!, COLLECTION_NAME))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Serrure))
    } catch (error) {
      console.error('Erreur lors de la récupération des serrures:', error)
      throw error
    }
  }

  /**
   * Récupère une serrure par son ID
   */
  const getSerrureById = async (id: string): Promise<Serrure | null> => {
    try {
      const docRef = doc(db!, COLLECTION_NAME, id)
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

  /**
   * Met à jour une serrure existante
   */
  const updateSerrure = async (id: string, serrure: Partial<Serrure>, photoFile?: File): Promise<void> => {
    try {
      const docRef = doc(db!, COLLECTION_NAME, id)
      
      // Si une nouvelle photo est fournie, la télécharger
      if (photoFile) {
        const photoUrl = await uploadPhoto(id, photoFile)
        serrure.photoUrl = photoUrl
      }
      
      await updateDoc(docRef, serrure)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la serrure:', error)
      throw error
    }
  }

  /**
   * Supprime une serrure et sa photo associée
   */
  const deleteSerrure = async (id: string): Promise<void> => {
    try {
      // Récupérer d'abord la serrure pour vérifier si elle a une photo
      const serrure = await getSerrureById(id)
      
      // Supprimer la photo si elle existe
      if (serrure?.photoUrl) {
        const storageRef = ref(storage!, `${COLLECTION_NAME}/${id}`)
        await deleteObject(storageRef)
      }
      
      // Supprimer le document
      const docRef = doc(db!, COLLECTION_NAME, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erreur lors de la suppression de la serrure:', error)
      throw error
    }
  }

  /**
   * Recherche des serrures par code article
   */
  const searchSerruresByCode = async (codeArticle: string): Promise<Serrure[]> => {
    try {
      const q = query(
        collection(db!, COLLECTION_NAME), 
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
    uploadPhoto
  }
} 