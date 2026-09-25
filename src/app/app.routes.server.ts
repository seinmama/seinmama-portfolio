import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './data/blog.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'flow/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'site/blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => BLOG_POSTS.map((post) => ({ slug: post.slug })),
  },
  {
    path: 'site/**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
