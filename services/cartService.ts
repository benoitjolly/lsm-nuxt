import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  type DocumentData 
} from 'firebase/firestore'
import type { Cart, CartItem } from '~/types/cart'
import type { Serrure } from '~/types/serrure'
import { useFirestore } from '~/composables/useFirestore'

export function useCartService() {
  const { db } = useFirestore()

  const COLLECTION_NAME = 'carts'

  // Générer un ID de panier anonyme
  const generateAnonymousCartId = () => {
    return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Obtenir le cart_id depuis le cookie/localStorage
  const getCartId = () => {
    if (typeof window === 'undefined') return null
    
    // Essayer d'abord le cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('cart_id='))
      ?.split('=')[1]
    
    if (cookieValue) {
      return cookieValue
    }
    
    // Fallback vers localStorage
    return localStorage.getItem('cart_id')
  }

  // Stocker le cart_id dans le cookie et localStorage
  const setCartId = (cartId: string) => {
    if (typeof window === 'undefined') return
    
    // Stocker dans le cookie (HttpOnly + Secure si possible)
    const cookieOptions = [
      `cart_id=${cartId}`,
      'path=/',
      'max-age=2592000', // 30 jours
      'SameSite=Strict'
    ]
    
    if (window.location.protocol === 'https:') {
      cookieOptions.push('Secure')
    }
    
    document.cookie = cookieOptions.join('; ')
    
    // Fallback vers localStorage
    localStorage.setItem('cart_id', cartId)
  }

  // Créer un nouveau panier anonyme (sans authentification requise)
  const createAnonymousCart = async (): Promise<string> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const cartId = generateAnonymousCartId()
      const cartData = {
        cartId,
        userId: null, // Panier anonyme - pas d'authentification requise
        items: [],
        totalItems: 0,
        updatedAt: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.fromDate(new Date())
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), cartData)
      
      // Stocker le cart_id
      setCartId(cartId)
      
      return cartId
    } catch (error) {
      console.error('Erreur lors de la création du panier anonyme:', error)
      throw error
    }
  }

  // Récupérer un panier par cart_id
  const getCart = async (cartId: string): Promise<Cart | null> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const q = query(collection(db, COLLECTION_NAME), where('cartId', '==', cartId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        
        return {
          id: doc.id,
          cartId: data.cartId,
          userId: data.userId,
          items: data.items.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })),
          totalItems: data.totalItems,
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error)
      throw error
    }
  }

  // Mettre à jour un panier
  const updateCart = async (cartId: string, cartData: Partial<Cart>): Promise<void> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const q = query(collection(db, COLLECTION_NAME), where('cartId', '==', cartId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const docRef = doc(db, COLLECTION_NAME, querySnapshot.docs[0].id)
        await updateDoc(docRef, {
          ...cartData,
          updatedAt: Timestamp.fromDate(new Date())
        })

      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error)
      throw error
    }
  }

  // Ajouter un article au panier
  const addItemToCart = async (cartId: string, serrure: Serrure, quantity: number = 1): Promise<Cart> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const currentCart = await getCart(cartId)
      if (!currentCart) {
        throw new Error('Panier non trouvé')
      }

      // Vérifier si l'article existe déjà
      const existingItemIndex = currentCart.items.findIndex(item => item.serrureId === serrure.id)
      
      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        currentCart.items[existingItemIndex].quantity += quantity
      } else {
        // Ajouter un nouvel article
        const newItem: CartItem = {
          id: `${serrure.id}_${Date.now()}`,
          serrureId: serrure.id || '',
          codeArticle: serrure.codeArticle,
          designation: serrure.designation,
          typeSerrureNom: serrure.typeSerrureNom,
          photoUrl: serrure.photoUrl,
          quantity,
          addedAt: new Date()
        }
        currentCart.items.push(newItem)
      }

      // Recalculer le total
      currentCart.totalItems = currentCart.items.reduce((total, item) => total + item.quantity, 0)
      currentCart.updatedAt = new Date()

      // Sauvegarder dans le backend
      await updateCart(cartId, currentCart)
      

      return currentCart
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'article:', error)
      throw error
    }
  }

  // Supprimer un article du panier
  const removeItemFromCart = async (cartId: string, itemId: string): Promise<Cart> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const currentCart = await getCart(cartId)
      if (!currentCart) {
        throw new Error('Panier non trouvé')
      }

      // Supprimer l'article
      currentCart.items = currentCart.items.filter(item => item.id !== itemId)
      currentCart.totalItems = currentCart.items.reduce((total, item) => total + item.quantity, 0)
      currentCart.updatedAt = new Date()

      // Sauvegarder dans le backend
      await updateCart(cartId, currentCart)
      

      return currentCart
    } catch (error) {
      console.error('Erreur lors de la suppression d\'article:', error)
      throw error
    }
  }

  // Mettre à jour la quantité d'un article
  const updateItemQuantity = async (cartId: string, itemId: string, quantity: number): Promise<Cart> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const currentCart = await getCart(cartId)
      if (!currentCart) {
        throw new Error('Panier non trouvé')
      }

      const itemIndex = currentCart.items.findIndex(item => item.id === itemId)
      if (itemIndex === -1) {
        throw new Error('Article non trouvé')
      }

      if (quantity <= 0) {
        // Supprimer l'article si quantité <= 0
        return await removeItemFromCart(cartId, itemId)
      } else {
        // Mettre à jour la quantité
        currentCart.items[itemIndex].quantity = quantity
        currentCart.totalItems = currentCart.items.reduce((total, item) => total + item.quantity, 0)
        currentCart.updatedAt = new Date()

        // Sauvegarder dans le backend
        await updateCart(cartId, currentCart)
        
  
        return currentCart
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de quantité:', error)
      throw error
    }
  }

  // Vider un panier
  const clearCart = async (cartId: string): Promise<Cart> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const emptyCart = {
        items: [],
        totalItems: 0,
        updatedAt: new Date()
      }

      await updateCart(cartId, emptyCart)
      

      return { ...emptyCart, id: '', cartId, userId: null }
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error)
      throw error
    }
  }

  // Associer un panier anonyme à un utilisateur
  const associateCartWithUser = async (cartId: string, userId: string): Promise<void> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      await updateCart(cartId, { userId })

    } catch (error) {
      console.error('Erreur lors de l\'association du panier:', error)
      throw error
    }
  }

  // Récupérer le panier d'un utilisateur
  const getUserCart = async (userId: string): Promise<Cart | null> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        
        return {
          id: doc.id,
          cartId: data.cartId,
          userId: data.userId,
          items: data.items.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })),
          totalItems: data.totalItems,
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération du panier utilisateur:', error)
      throw error
    }
  }

  return {
    getCartId,
    setCartId,
    createAnonymousCart,
    getCart,
    updateCart,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    associateCartWithUser,
    getUserCart
  }
}
