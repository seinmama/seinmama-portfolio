export interface BlogBlock {
  kind: 'heading' | 'paragraph' | 'code';
  text: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  kicker: string;
  readMinutes: number;
  excerpt: string;
  tags: string[];
  // Full post, revealed by "read more". Posts without a body show only the excerpt.
  body?: readonly BlogBlock[];
}
