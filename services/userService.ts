import { initializeFirebase } from '~/utils/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'

export interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  roles: string[]
  createdAt: number
  lastLoginAt: number
}

export const useUserService = () => {
  const { db } = initializeFirebase()

  // Créer ou mettre à jour un utilisateur dans Firestore lors de la connexion
  const createOrUpdateUser = async (user: User): Promise<void> => {
    if (!db || !user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      // Première connexion, créer un nouvel utilisateur
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        roles: [], // Par défaut, aucun rôle
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      }
      await setDoc(userRef, userData)
    } else {
      // Mise à jour des informations de l'utilisateur
      await updateDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLoginAt: Date.now()
      })
    }
  }

  // Récupérer les données d'un utilisateur
  const getUserData = async (uid: string): Promise<UserData | null> => {
    if (!db) return null

    const userRef = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userRef)

    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserData
    }

    return null
  }

  // Ajouter un rôle à un utilisateur
  const addRoleToUser = async (uid: string, role: string): Promise<void> => {
    if (!db) return

    const userRef = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userRef)

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData
      const roles = userData.roles || []

      if (!roles.includes(role)) {
        roles.push(role)
        await updateDoc(userRef, { roles })
      }
    }
  }

  // Supprimer un rôle d'un utilisateur
  const removeRoleFromUser = async (uid: string, role: string): Promise<void> => {
    if (!db) return

    const userRef = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userRef)

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData
      const roles = userData.roles || []

      const updatedRoles = roles.filter(r => r !== role)
      await updateDoc(userRef, { roles: updatedRoles })
    }
  }

  return {
    createOrUpdateUser,
    getUserData,
    addRoleToUser,
    removeRoleFromUser
  }
} 