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
  type DocumentData 
} from 'firebase/firestore'
import type { Order } from '~/types/cart'
import { OrderStatus } from '~/types/cart'
import { useFirestore } from '~/composables/useFirestore'

export function useOrderService() {
  const { db } = useFirestore()

  const COLLECTION_NAME = 'orders'

  // Créer une nouvelle commande
  const createOrder = async (order: Order): Promise<string> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        throw new Error('Firestore non disponible')
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...order,
        orderDate: order.orderDate,
        items: order.items.map(item => ({
          ...item,
          addedAt: item.addedAt
        }))
      })
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      throw error
    }
  }

  // Obtenir une commande par ID
  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible (probablement côté serveur)')
        return null
      }

      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
          items: data.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })) || []
        } as Order
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error)
      throw error
    }
  }

  // Obtenir toutes les commandes d'un utilisateur
  const getUserOrders = async (userId: string, limitCount: number = 50): Promise<Order[]> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible (probablement côté serveur)')
        return []
      }

      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('orderDate', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const orders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
          items: data.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })) || []
        } as Order)
      })
      
      return orders
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes utilisateur:', error)
      throw error
    }
  }

  // Obtenir toutes les commandes (pour les administrateurs)
  const getAllOrders = async (limitCount: number = 100): Promise<Order[]> => {
    try {
      // Vérifier que la base de données est disponible
      if (!db) {
        console.warn('Firestore non disponible (probablement côté serveur)')
        return []
      }

      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('orderDate', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const orders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
          items: data.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })) || []
        } as Order)
      })
      
      return orders
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les commandes:', error)
      throw error
    }
  }

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      if (!db) { throw new Error('Firestore non disponible') }
      const docRef = doc(db, COLLECTION_NAME, orderId)
      await updateDoc(docRef, { status })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error)
      throw error
    }
  }

  // Mettre à jour une commande
  const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
    try {
      if (!db) { throw new Error('Firestore non disponible') }
      const docRef = doc(db, COLLECTION_NAME, orderId)
      
      // Préparer les données à mettre à jour
      const updateData: any = { ...updates }
      
      // Convertir les dates si nécessaire
      if (updates.items) {
        updateData.items = updates.items.map(item => ({
          ...item,
          addedAt: item.addedAt
        }))
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error)
      throw error
    }
  }

  // Supprimer une commande
  const deleteOrder = async (orderId: string): Promise<void> => {
    try {
      if (!db) { throw new Error('Firestore non disponible') }
      const docRef = doc(db, COLLECTION_NAME, orderId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error)
      throw error
    }
  }

  // Obtenir les commandes par statut
  const getOrdersByStatus = async (status: OrderStatus, limitCount: number = 50): Promise<Order[]> => {
    try {
      if (!db) { throw new Error('Firestore non disponible') }
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status),
        orderBy('orderDate', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const orders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
          items: data.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt?.toDate() || new Date()
          })) || []
        } as Order)
      })
      
      return orders
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes par statut:', error)
      throw error
    }
  }

  // Obtenir les statistiques des commandes
  const getOrderStats = async () => {
    try {
      const allOrders = await getAllOrders(1000) // Limite plus élevée pour les stats
      
      const stats = {
        total: allOrders.length,
        pending: allOrders.filter(order => order.status === OrderStatus.PENDING).length,
        processing: allOrders.filter(order => order.status === OrderStatus.PROCESSING).length,
        shipped: allOrders.filter(order => order.status === OrderStatus.SHIPPED).length,
        delivered: allOrders.filter(order => order.status === OrderStatus.DELIVERED).length,
        cancelled: allOrders.filter(order => order.status === OrderStatus.CANCELLED).length,
        totalItems: allOrders.reduce((sum, order) => sum + order.totalItems, 0)
      }
      
      return stats
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      throw error
    }
  }

  return {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getOrdersByStatus,
    getOrderStats
  }
}
