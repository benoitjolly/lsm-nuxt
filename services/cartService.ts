import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  type DocumentData 
} from 'firebase/firestore'
import type { Cart } from '~/types/cart'
import { useFirestore } from '~/composables/useFirestore'

export function useCartService() {
  const { db } = useFirestore()

  const COLLECTION_NAME = 'carts'

  // Sauvegarder le panier d'un utilisateur
  const saveUserCart = async (userId: string, cart: Cart): Promise<void> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible')
        return
      }

      const cartRef = doc(db, COLLECTION_NAME, userId)
      await setDoc(cartRef, {
        ...cart,
        updatedAt: cart.updatedAt,
        items: cart.items.map(item => ({
          ...item,
          addedAt: item.addedAt
        }))
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error)
      throw error
    }
  }

  // Charger le panier d'un utilisateur
  const loadUserCart = async (userId: string): Promise<Cart | null> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible')
        return null
      }

      const cartRef = doc(db, COLLECTION_NAME, userId)
      const cartSnap = await getDoc(cartRef)
      
      if (cartSnap.exists()) {
        const data = cartSnap.data()
        return {
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date(),
          items: data.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })) || []
        } as Cart
      }
      return null
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      throw error
    }
  }

  // Supprimer le panier d'un utilisateur
  const deleteUserCart = async (userId: string): Promise<void> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible')
        return
      }

      const cartRef = doc(db, COLLECTION_NAME, userId)
      await deleteDoc(cartRef)
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error)
      throw error
    }
  }

  return {
    saveUserCart,
    loadUserCart,
    deleteUserCart
  }
}
