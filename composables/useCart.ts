import { ref, computed, watch, readonly } from 'vue'
import type { Cart, CartItem, Order, ShippingAddress } from '~/types/cart'
import { OrderStatus } from '~/types/cart'
import type { Serrure } from '~/types/serrure'
import useAuth from '~/composables/useAuth'
import { useCartService } from '~/services/cartService'

const cart = ref<Cart>({
  items: [],
  totalItems: 0,
  updatedAt: new Date()
})

export default function useCart() {
  const { user } = useAuth()
  const { saveUserCart, loadUserCart, deleteUserCart } = useCartService()

  // Clé de stockage locale basée sur l'utilisateur
  const getStorageKey = () => {
    return user.value ? `cart_${user.value.uid}` : 'cart_anonymous'
  }

  // Charger le panier (localStorage + backend si connecté)
  const loadCart = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Si l'utilisateur est connecté, charger depuis le backend
        if (user.value?.uid) {
          const backendCart = await loadUserCart(user.value.uid)
          if (backendCart) {
            cart.value = backendCart
            // Synchroniser avec localStorage
            localStorage.setItem(getStorageKey(), JSON.stringify(cart.value))
            return
          }
        }

        // Fallback: charger depuis localStorage
        const stored = localStorage.getItem(getStorageKey())
        if (stored) {
          const parsedCart = JSON.parse(stored)
          // Convertir les dates string en objets Date
          parsedCart.updatedAt = new Date(parsedCart.updatedAt)
          parsedCart.items.forEach((item: CartItem) => {
            item.addedAt = new Date(item.addedAt)
          })
          cart.value = parsedCart
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error)
        clearCart()
      }
    }
  }

  // Sauvegarder le panier (localStorage + backend si connecté)
  const saveCart = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Sauvegarder dans localStorage
        localStorage.setItem(getStorageKey(), JSON.stringify(cart.value))
        
        // Si l'utilisateur est connecté, sauvegarder aussi dans le backend
        if (user.value?.uid) {
          await saveUserCart(user.value.uid, cart.value)
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error)
      }
    }
  }

  // Watcher pour sauvegarder automatiquement
  watch(cart, () => {
    saveCart()
  }, { deep: true })

  // Watcher pour recharger le panier quand l'utilisateur change
  watch(user, async (newUser, oldUser) => {
    if (newUser && !oldUser) {
      // Utilisateur vient de se connecter
      await syncCartOnLogin()
    } else if (newUser && oldUser && newUser.uid !== oldUser.uid) {
      // Utilisateur a changé (déconnexion puis reconnexion)
      await loadCart()
    } else if (!newUser && oldUser) {
      // Utilisateur vient de se déconnecter
      await loadCart()
    }
  })

  // Synchroniser le panier lors de la connexion
  const syncCartOnLogin = async () => {
    if (!user.value?.uid) return

    try {
      // Charger le panier anonyme depuis localStorage
      const anonymousCartKey = 'cart_anonymous'
      const anonymousCartData = localStorage.getItem(anonymousCartKey)
      
      if (anonymousCartData) {
        const anonymousCart = JSON.parse(anonymousCartData)
        
        // Charger le panier utilisateur depuis le backend
        const userCart = await loadUserCart(user.value.uid)
        
        if (userCart && userCart.items.length > 0) {
          // Fusionner les paniers
          const mergedItems = [...userCart.items]
          
          anonymousCart.items.forEach((anonymousItem: CartItem) => {
            const existingItem = mergedItems.find(item => item.serrureId === anonymousItem.serrureId)
            if (existingItem) {
              existingItem.quantity += anonymousItem.quantity
            } else {
              mergedItems.push(anonymousItem)
            }
          })
          
          cart.value = {
            ...userCart,
            items: mergedItems
          }
        } else {
          // Utiliser le panier anonyme
          cart.value = {
            ...anonymousCart,
            updatedAt: new Date(anonymousCart.updatedAt),
            items: anonymousCart.items.map((item: CartItem) => ({
              ...item,
              addedAt: new Date(item.addedAt)
            }))
          }
        }
        
        // Sauvegarder le panier fusionné
        await saveCart()
        
        // Supprimer le panier anonyme
        localStorage.removeItem(anonymousCartKey)
      } else {
        // Pas de panier anonyme, charger le panier utilisateur
        await loadCart()
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation du panier:', error)
      await loadCart()
    }
  }

  // Calculer le total d'articles
  const updateTotalItems = () => {
    cart.value.totalItems = cart.value.items.reduce((total, item) => total + item.quantity, 0)
    cart.value.updatedAt = new Date()
  }

  // Computed pour itemCount avec gestion de l'hydratation
  const itemCount = computed(() => {
    // Côté serveur, retourner 0 pour éviter les problèmes d'hydratation
    if (typeof window === 'undefined') {
      return 0
    }
    return cart.value.totalItems
  })

  // Ajouter un article au panier
  const addToCart = (serrure: Serrure, quantity: number = 1) => {
    const existingItem = cart.value.items.find(item => item.serrureId === serrure.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const newItem: CartItem = {
        id: `${serrure.id}_${Date.now()}`,
        serrureId: serrure.id!,
        codeArticle: serrure.codeArticle,
        designation: serrure.designation,
        typeSerrureNom: serrure.typeSerrureNom,
        photoUrl: serrure.photoUrl,
        quantity,
        addedAt: new Date()
      }
      cart.value.items.push(newItem)
    }
    
    updateTotalItems()
  }

  // Retirer un article du panier
  const removeFromCart = (itemId: string) => {
    const index = cart.value.items.findIndex(item => item.id === itemId)
    if (index > -1) {
      cart.value.items.splice(index, 1)
      updateTotalItems()
    }
  }

  // Mettre à jour la quantité d'un article
  const updateQuantity = (itemId: string, quantity: number) => {
    const item = cart.value.items.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
        updateTotalItems()
      }
    }
  }

  // Vider le panier
  const clearCart = async () => {
    cart.value = {
      items: [],
      totalItems: 0,
      updatedAt: new Date()
    }
    
    // Si l'utilisateur est connecté, supprimer aussi du backend
    if (user.value?.uid) {
      try {
        await deleteUserCart(user.value.uid)
      } catch (error) {
        console.error('Erreur lors de la suppression du panier backend:', error)
      }
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
    if (!user.value) {
      throw new Error('Utilisateur non connecté')
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

  // Propriétés calculées
  const isEmpty = computed(() => cart.value.items.length === 0)
  const items = computed(() => cart.value.items)

  // Charger le panier au démarrage
  if (typeof window !== 'undefined') {
    loadCart()
  }

  return {
    // État
    cart: readonly(cart),
    items,
    isEmpty,
    itemCount,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantityInCart,
    createOrderFromCart,
    loadCart,
    syncCartOnLogin,
    
    // Utilitaires
    updateTotalItems
  }
}
