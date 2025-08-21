import { ref, computed, watch, readonly } from 'vue'
import type { Cart, CartItem, Order, ShippingAddress } from '~/types/cart'
import { OrderStatus } from '~/types/cart'
import type { Serrure } from '~/types/serrure'
import useAuth from '~/composables/useAuth'
import { useCartService } from '~/services/cartService'

// Fonction pour déclencher l'animation de la pastille
const triggerCartAnimation = () => {
  if (typeof window !== 'undefined' && (window as any).triggerCartAnimation) {
    (window as any).triggerCartAnimation()
  }
}

// État local du panier (miroir pour UX rapide)
const cart = ref<Cart>({
  items: [],
  totalItems: 0,
  updatedAt: new Date()
})

// État de synchronisation
const isSyncing = ref(false)
const lastSyncTimestamp = ref<number>(0)

export default function useCart() {
  const { user } = useAuth()
  const { 
    getCartId, 
    setCartId, 
    createAnonymousCart, 
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    updateItemQuantity, 
    clearCart: clearCartBackend, 
    associateCartWithUser, 
    getUserCart 
  } = useCartService()

  // Mettre à jour le total des articles localement
  const updateLocalTotal = () => {
    cart.value.totalItems = cart.value.items.reduce((total, item) => total + item.quantity, 0)
    cart.value.updatedAt = new Date()
  }

  // Sauvegarder le snapshot local dans localStorage
  const saveLocalSnapshot = () => {
    if (typeof window !== 'undefined') {
      try {
        const snapshot = {
          items: cart.value.items,
          totalItems: cart.value.totalItems,
          timestamp: Date.now()
        }
        localStorage.setItem('cart_snapshot', JSON.stringify(snapshot))
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du snapshot local:', error)
      }
    }
  }

  // Charger le snapshot local depuis localStorage
  const loadLocalSnapshot = () => {
    if (typeof window !== 'undefined') {
      try {
        const snapshotData = localStorage.getItem('cart_snapshot')
        if (snapshotData) {
          const snapshot = JSON.parse(snapshotData)
          cart.value.items = snapshot.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
          cart.value.totalItems = snapshot.totalItems
          cart.value.updatedAt = new Date(snapshot.timestamp)
          return true
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement du snapshot local:', error)
      }
    }
    return false
  }

  // Synchroniser avec le backend
  const syncWithBackend = async (force = false) => {
    if (isSyncing.value) return
    
    try {
      isSyncing.value = true
      let cartId = getCartId()
      
      // Si pas de cart_id, en créer un nouveau
      if (!cartId) {
        cartId = await createAnonymousCart()
      }
      
      // Récupérer le panier depuis le backend
      const backendCart = await getCart(cartId)
      
      if (backendCart) {
        // Vérifier si le backend est plus récent que le local
        const backendTimestamp = backendCart.updatedAt.getTime()
        const localTimestamp = lastSyncTimestamp.value
        
        if (force || backendTimestamp > localTimestamp) {
          cart.value = backendCart
          lastSyncTimestamp.value = backendTimestamp
          saveLocalSnapshot()
        }
      } else {
        cartId = await createAnonymousCart()
        const newCart = await getCart(cartId)
        if (newCart) {
          cart.value = newCart
          lastSyncTimestamp.value = newCart.updatedAt.getTime()
          saveLocalSnapshot()
        }
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error)
      // En cas d'erreur, utiliser le snapshot local
      loadLocalSnapshot()
    } finally {
      isSyncing.value = false
    }
  }

  // Charger le panier (backend + fallback local)
  const loadCart = async () => {
    // Charger d'abord le snapshot local pour UX rapide
    loadLocalSnapshot()
    
    // Synchroniser avec le backend
    await syncWithBackend()
  }

  // Ajouter un article au panier (fonctionne même sans authentification)
  const addToCart = async (serrure: Serrure, quantity: number = 1) => {
    try {
      let cartId = getCartId()
      
      // Si pas de cart_id, en créer un nouveau (anonyme)
      if (!cartId) {
        cartId = await createAnonymousCart()
      }
      
      // Ajouter l'article dans le backend
      const updatedCart = await addItemToCart(cartId, serrure, quantity)
      
      // Mettre à jour l'état local
      cart.value = updatedCart
      lastSyncTimestamp.value = updatedCart.updatedAt.getTime()
      saveLocalSnapshot()
      
      // Déclencher l'animation de la pastille
      triggerCartAnimation()
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'article:', error)
      
      // Fallback local en cas d'erreur
      const existingItem = cart.value.items.find(item => item.serrureId === serrure.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
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
        cart.value.items.push(newItem)
      }
      
      updateLocalTotal()
      saveLocalSnapshot()
      
      // Déclencher l'animation même en cas d'erreur
      triggerCartAnimation()
    }
  }

  // Retirer un article du panier
  const removeFromCart = async (itemId: string) => {
    try {
      const cartId = getCartId()
      if (cartId) {
        const updatedCart = await removeItemFromCart(cartId, itemId)
        cart.value = updatedCart
        lastSyncTimestamp.value = updatedCart.updatedAt.getTime()
        saveLocalSnapshot()
      } else {
        // Fallback local
        cart.value.items = cart.value.items.filter(item => item.id !== itemId)
        updateLocalTotal()
        saveLocalSnapshot()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      // Fallback local
      cart.value.items = cart.value.items.filter(item => item.id !== itemId)
      updateLocalTotal()
      saveLocalSnapshot()
    }
  }

  // Mettre à jour la quantité d'un article
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const cartId = getCartId()
      if (cartId) {
        const updatedCart = await updateItemQuantity(cartId, itemId, quantity)
        cart.value = updatedCart
        lastSyncTimestamp.value = updatedCart.updatedAt.getTime()
        saveLocalSnapshot()
      } else {
        // Fallback local
        const item = cart.value.items.find(item => item.id === itemId)
        if (item) {
          if (quantity <= 0) {
            cart.value.items = cart.value.items.filter(item => item.id !== itemId)
          } else {
            item.quantity = quantity
          }
          updateLocalTotal()
          saveLocalSnapshot()
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de quantité:', error)
      // Fallback local
      const item = cart.value.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          cart.value.items = cart.value.items.filter(item => item.id !== itemId)
        } else {
          item.quantity = quantity
        }
        updateLocalTotal()
        saveLocalSnapshot()
      }
    }
  }

    // Vider le panier
  const clearCart = async () => {
    try {
      const cartId = getCartId()
      if (cartId) {
        const emptyCart = await clearCartBackend(cartId)
        cart.value = emptyCart
        lastSyncTimestamp.value = emptyCart.updatedAt.getTime()
        saveLocalSnapshot()
      } else {
        // Fallback local
        cart.value = {
          items: [],
          totalItems: 0,
          updatedAt: new Date()
        }
        saveLocalSnapshot()
      }
    } catch (error) {
      console.error('Erreur lors du vidage:', error)
      // Fallback local
      cart.value = {
        items: [],
        totalItems: 0,
        updatedAt: new Date()
      }
      saveLocalSnapshot()
    }
  }

  // Vérifier si un article est dans le panier
  const isInCart = (serrureId: string) => {
    return cart.value.items.some(item => item.serrureId === serrureId)
  }

  // Obtenir la quantité d'un article dans le panier
  const getQuantityInCart = (serrureId: string) => {
    const item = cart.value.items.find(item => item.serrureId === serrureId)
    return item ? item.quantity : 0
  }

  // Créer une commande à partir du panier
  const createOrderFromCart = (shippingAddress: ShippingAddress, notes?: string): Order => {
    if (!user.value?.uid) {
      throw new Error('Utilisateur non connecté')
    }

    if (cart.value.items.length === 0) {
      throw new Error('Panier vide')
    }

    const order: Order = {
      userId: user.value.uid,
      items: [...cart.value.items],
      shippingAddress,
      status: OrderStatus.PENDING,
      totalItems: cart.value.totalItems,
      orderDate: new Date(),
      notes
    }

    return order
  }

  // Watcher pour gérer la connexion/déconnexion
  watch(user, async (newUser, oldUser) => {
    if (newUser?.uid !== oldUser?.uid) {
      if (newUser && !oldUser) {
        // Utilisateur vient de se connecter
        try {
          const cartId = getCartId()
          if (cartId) {
            await associateCartWithUser(cartId, newUser.uid)
            // Synchroniser pour récupérer les données mises à jour
            await syncWithBackend(true)
          }
        } catch (error) {
          console.error('Erreur lors de l\'association du panier:', error)
        }
      } else {
        // Utilisateur s'est déconnecté ou changé
        await loadCart()
      }
    }
  })

  // Propriétés calculées
  const isEmpty = computed(() => cart.value.items.length === 0)
  const items = computed(() => cart.value.items)
  const itemCount = computed(() => cart.value.totalItems)

  // Charger le panier au démarrage
  if (typeof window !== 'undefined') {
    loadCart()
  }

  return {
    cart: readonly(cart),
    items,
    isEmpty,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantityInCart,
    createOrderFromCart,
    loadCart,
    syncWithBackend,
    isSyncing: readonly(isSyncing),
    

  }
}
