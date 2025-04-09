import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useFirestore } from '~/composables/useFirestore'
import type { TypeSerrure } from '~/types/typeSerrure'

export const useTypeSerrureService = () => {
  const db = useFirestore()
  const typesCollection = collection(db, 'types-serrures')
  
  // Récupérer tous les types de serrures
  const getAllTypesSerrures = async (): Promise<TypeSerrure[]> => {
    const typesSnapshot = await getDocs(typesCollection)
    return typesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TypeSerrure[]
  }
  
  // Ajouter un nouveau type de serrure
  const addTypeSerrure = async (typeSerrure: TypeSerrure): Promise<TypeSerrure> => {
    const docRef = await addDoc(typesCollection, typeSerrure)
    return {
      id: docRef.id,
      ...typeSerrure
    }
  }
  
  // Supprimer un type de serrure
  const deleteTypeSerrure = async (id: string): Promise<void> => {
    await deleteDoc(doc(typesCollection, id))
  }
  
  // Mettre à jour un type de serrure
  const updateTypeSerrure = async (id: string, typeSerrure: Partial<TypeSerrure>): Promise<void> => {
    await updateDoc(doc(typesCollection, id), typeSerrure)
  }
  
  // Récupérer un type de serrure par son ID
  const getTypeSerrureById = async (id: string): Promise<TypeSerrure | null> => {
    const docRef = doc(typesCollection, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as TypeSerrure
    }
    
    return null
  }
  
  return {
    getAllTypesSerrures,
    addTypeSerrure,
    deleteTypeSerrure,
    updateTypeSerrure,
    getTypeSerrureById
  }
} 