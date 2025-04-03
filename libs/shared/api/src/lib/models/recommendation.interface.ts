export interface Recommendation {
  id: number | string;
  titel: string;
  artiest: string;
  genre?: string;  // Optioneel voor bestaande code
  recommendationType: 'genre' | 'artist';  // Nieuw veld
}
