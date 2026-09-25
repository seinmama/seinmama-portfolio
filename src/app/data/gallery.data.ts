import { GalleryItem } from '../core/models';

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  { id: 'shot-1', title: 'Shot one', src: '/images/gallery/shot-1.jpg', alt: 'Placeholder gallery image one' },
  { id: 'shot-2', title: 'Shot two', src: '/images/gallery/shot-2.jpg', alt: 'Placeholder gallery image two' },
  { id: 'shot-3', title: 'Shot three', src: '/images/gallery/shot-3.jpg', alt: 'Placeholder gallery image three' },
];

// Shown first in the gallery once the visitor unlocks it on the bestie quiz.
export const SECRET_GALLERY_ITEM: GalleryItem = {
  id: 'geo-gal-secret',
  title: '🔓 secret: bestie pic',
  src: '/images/gallery/secret.jpg',
  alt: 'A secret photo for besties',
  date: 'friends only',
};
