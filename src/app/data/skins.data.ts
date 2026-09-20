import { Skin } from '../core/models';

export const SKINS: readonly Skin[] = [
  {
    id: 'newspaper',
    name: 'Newspaper',
    tagline: 'Ink, columns, dated headlines.',
    swatch: '#2b2b2b',
    gradient: 'linear-gradient(135deg, #e7e3d8, #cfc9ba)',
    icon: '📰',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    tagline: 'Warm, analog, unhurried.',
    swatch: '#c17a3f',
    gradient: 'linear-gradient(135deg, #3a2418, #a3703f)',
    icon: '☕',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    tagline: 'Deep blue, slow currents.',
    swatch: '#0e7ea8',
    gradient: 'linear-gradient(135deg, #0a4a63, #1fb6c9)',
    icon: '🌊',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Quiet, indigo, after hours.',
    swatch: '#7a5cff',
    gradient: 'linear-gradient(135deg, #241a4d, #6a4fd6)',
    icon: '🌙',
  },
  {
    id: 'nature',
    name: 'Nature',
    tagline: 'Green, grounded, growing.',
    swatch: '#5fa35a',
    gradient: 'linear-gradient(135deg, #234a1f, #6fbf5f)',
    icon: '🌿',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    tagline: 'Neon, loud, wired-in.',
    swatch: '#ff2bd6',
    gradient: 'linear-gradient(135deg, #1a0a2b, #ff2bd6)',
    icon: '🌆',
  },
];
