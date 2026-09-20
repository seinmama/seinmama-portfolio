export type SkinId = 'newspaper' | 'coffee' | 'ocean' | 'midnight' | 'nature' | 'cyberpunk';

export interface Skin {
  id: SkinId;
  name: string;
  tagline: string;
  swatch: string;
  gradient: string;
  icon: string;
}
