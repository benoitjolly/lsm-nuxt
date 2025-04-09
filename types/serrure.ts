export interface Serrure {
  id?: string;
  codeArticle: string;
  typeSerrureId?: string;  // ID du type de serrure
  typeSerrureNom?: string; // Nom du type de serrure (pour l'affichage facile)
  typeDeCle?: string;
  designation?: string;
  longueurDuCorpsMm: number;
  course?: string;
  sens?: string;
  sortieDeCle?: string;
  fixationSerrure?: string;
  pgPossible?: string;
  typeDeCame: string;
  photoUrl?: string;
  planUrl?: string;
} 