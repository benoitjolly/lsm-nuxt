import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  type DocumentData 
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import type { Order } from '~/types/cart'
import { OrderStatus } from '~/types/cart'
import { useFirestore } from '~/composables/useFirestore'

export function useOrderService() {
  const { db } = useFirestore()

  const COLLECTION_NAME = 'orders'

  // Créer une nouvelle commande
  const createOrder = async (order: Order): Promise<string> => {
    try {
      console.log('🔄 Création de commande dans orderService...')
      console.log('📋 Données de la commande:', order)
      
      // Vérifier l'authentification
      const auth = getAuth()
      const currentUser = auth.currentUser
      console.log('🔐 Utilisateur authentifié:', currentUser?.uid)
      console.log('🔐 userId dans la commande:', order.userId)
      console.log('🔐 Correspondance:', currentUser?.uid === order.userId)
      
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié')
      }
      
      if (currentUser.uid !== order.userId) {
        throw new Error('userId ne correspond pas à l\'utilisateur authentifié')
      }
      
      // Vérifier que la base de données est disponible
      if (!db) {
        throw new Error('Firestore non disponible')
      }
      
      // Plus besoin de vérifier/créer l'utilisateur - les règles Firestore sont maintenant permissives
      console.log('✅ Utilisateur authentifié, création de commande autorisée')

      // Préparer les données pour Firestore
      const orderData = {
        ...order,
        orderDate: Timestamp.fromDate(order.orderDate),
        items: order.items.map(item => ({
          ...item,
          addedAt: Timestamp.fromDate(item.addedAt)
        }))
      }
      
      console.log('📤 Données à envoyer à Firestore:', orderData)
      console.log('🏪 Collection:', COLLECTION_NAME)

      const docRef = await addDoc(collection(db, COLLECTION_NAME), orderData)
      console.log('✅ Commande créée avec succès, ID:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('❌ Erreur lors de la création de la commande dans orderService:', error)
      console.error('🔍 Code d\'erreur:', error?.code)
      console.error('🔍 Message d\'erreur:', error?.message)
      throw error
    }
  }

  // Obtenir toutes les commandes d'un utilisateur
  const getUserOrders = async (userId: string): Promise<Order[]> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('orderDate', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const orders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          shippingAddress: data.shippingAddress,
          status: data.status,
          totalItems: data.totalItems,
          orderDate: data.orderDate.toDate(),
          notes: data.notes
        })
      })
      
      return orders
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error)
      throw error
    }
  }

  // Obtenir toutes les commandes (admin)
  const getAllOrders = async (): Promise<Order[]> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('orderDate', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const orders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          shippingAddress: data.shippingAddress,
          status: data.status,
          totalItems: data.totalItems,
          orderDate: data.orderDate.toDate(),
          notes: data.notes
        })
      })
      
      return orders
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les commandes:', error)
      throw error
    }
  }

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const orderRef = doc(db, COLLECTION_NAME, orderId)
      await updateDoc(orderRef, { status })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      throw error
    }
  }

  // Supprimer une commande
  const deleteOrder = async (orderId: string): Promise<void> => {
    if (!db) throw new Error('Firestore non disponible')

    try {
      const orderRef = doc(db, COLLECTION_NAME, orderId)
      await deleteDoc(orderRef)
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error)
      throw error
    }
  }

  return {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
  }
}
