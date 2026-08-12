import { BlogPost } from '../core/models';

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'building-a-zune-themed-portfolio',
    title: 'Building a Zune-themed portfolio',
    date: '2026-01-12',
    excerpt: 'Why I went with an audience-and-skin picker instead of a static homepage.',
    tags: ['angular', 'design'],
  },
  {
    slug: 'ssr-and-view-transitions',
    title: 'SSR, view transitions, and a funnel that has to feel instant',
    date: '2026-02-03',
    excerpt: 'Notes on keeping the pre-site flow client-rendered while prerendering the rest.',
    tags: ['angular', 'ssr'],
  },
];
