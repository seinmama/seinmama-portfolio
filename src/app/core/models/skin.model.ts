export type SkinId = 'coffee' | 'nature' | 'cyberpunk' | 'aurora';

export interface Skin {
  id: SkinId;
  name: string;
  tagline: string;
  swatch: string;
}
