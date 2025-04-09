import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { initializeFirebase } from '~/utils/firebase'
import type { TypeSerrure } from '~/types/typeSerrure'

export const useTypeSerrureService = () => {
  // Initialiser Firebase directement dans le service
  const { db } = initializeFirebase()
  
  if (!db) {
    console.error('Firebase n\'est pas correctement initialisé')
  }
  
  // Récupérer tous les types de serrures
  const getAllTypesSerrures = async (): Promise<TypeSerrure[]> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const typesCollection = collection(db, 'types-serrures')
      const typesSnapshot = await getDocs(typesCollection)
      
      return typesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TypeSerrure[]
    } catch (error) {
      console.error('Erreur lors de la récupération des types de serrures:', error)
      throw error
    }
  }
  
  // Ajouter un nouveau type de serrure
  const addTypeSerrure = async (typeSerrure: TypeSerrure): Promise<TypeSerrure> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const typesCollection = collection(db, 'types-serrures')
      const docRef = await addDoc(typesCollection, typeSerrure)
      
      return {
        id: docRef.id,
        ...typeSerrure
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de serrure:', error)
      throw error
    }
  }
  
  // Supprimer un type de serrure
  const deleteTypeSerrure = async (id: string): Promise<void> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      await deleteDoc(doc(db, 'types-serrures', id))
    } catch (error) {
      console.error('Erreur lors de la suppression du type de serrure:', error)
      throw error
    }
  }
  
  // Mettre à jour un type de serrure
  const updateTypeSerrure = async (id: string, typeSerrure: Partial<TypeSerrure>): Promise<void> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      await updateDoc(doc(db, 'types-serrures', id), typeSerrure)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du type de serrure:', error)
      throw error
    }
  }
  
  // Récupérer un type de serrure par son ID
  const getTypeSerrureById = async (id: string): Promise<TypeSerrure | null> => {
    try {
      if (!db) throw new Error('Firebase n\'est pas initialisé')
      
      const docRef = doc(db, 'types-serrures', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as TypeSerrure
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération du type de serrure:', error)
      throw error
    }
  }
  
  return {
    getAllTypesSerrures,
    addTypeSerrure,
    deleteTypeSerrure,
    updateTypeSerrure,
    getTypeSerrureById
  }
} 