import { BlogPost } from '../core/models';

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'shipping-a-design-system-nobody-asked-for',
    title: 'shipping a design system nobody asked for',
    date: 'JUL 09',
    kicker: 'FIELD NOTES',
    excerpt:
      'it started as a folder of buttons. a year later half the company depends on it — heres what id do differently.',
    tags: ['design-systems'],
  },
  {
    slug: 'the-grid-finally-clicked',
    title: 'the grid finally clicked',
    date: 'JUN 22',
    kicker: 'CSS',
    excerpt: 'after years of flexbox gymnastics, subgrid totally rewired how i think about layout. a lil love letter.',
    tags: ['css'],
  },
];
