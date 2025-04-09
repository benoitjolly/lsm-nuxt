import { useRuntimeConfig } from '#app'

export const useSeoConfig = () => {
  const config = useRuntimeConfig()
  
  // Variables principales du site
  const siteUrl = config.public.siteUrl || 'https://votredomaine.com'
  const siteName = config.public.siteName || 'Serrures Professionnelles'
  
  // Comptes de réseaux sociaux
  const twitterHandle = config.public.twitterHandle || '@votre_compte_twitter'
  const googleVerification = config.public.googleVerification || 'votre_code_verification'
  
  // Images par défaut
  const defaultOgImage = `${siteUrl}/og-image-homepage.jpg`
  const defaultTwitterImage = `${siteUrl}/twitter-image-homepage.jpg`
  const defaultProductImage = `${siteUrl}/placeholder-serrure.jpg`
  
  // Locale par défaut
  const defaultLocale = 'fr_FR'
  
  // Fonction pour gérer les auteurs (string ou string[])
  const formatAuthor = (author: string | string[] | undefined): string[] => {
    if (!author) return [siteName]
    if (typeof author === 'string') return [author]
    return author
  }
  
  // Fonction pour définir le type Open Graph (avec les types permis)
  const getOgType = (type: string): "article" | "website" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_status" | "video.movie" | "video.episode" | "video.tv_show" | "video.other" | null | undefined => {
    const validTypes = [
      'article', 'website', 'book', 'profile', 
      'music.song', 'music.album', 'music.playlist', 'music.radio_status',
      'video.movie', 'video.episode', 'video.tv_show', 'video.other'
    ]
    
    if (validTypes.includes(type)) {
      return type as any
    }
    return 'website'
  }
  
  return {
    siteUrl,
    siteName,
    twitterHandle,
    googleVerification,
    defaultOgImage,
    defaultTwitterImage,
    defaultProductImage,
    defaultLocale,
    formatAuthor,
    getOgType
  }
} 