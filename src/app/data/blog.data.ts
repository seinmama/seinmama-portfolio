import { BlogPost } from '../core/models';

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'shipping-a-design-system-nobody-asked-for',
    title: 'shipping a design system nobody asked for',
    date: 'JUL 09',
    kicker: 'FIELD NOTES',
    readMinutes: 4,
    excerpt:
      'it started as a folder of buttons. a year later half the company depends on it — heres what id do differently.',
    tags: ['design-systems'],
  },
  {
    slug: 'the-grid-finally-clicked',
    title: 'the grid finally clicked',
    date: 'JUN 22',
    kicker: 'CSS',
    readMinutes: 3,
    excerpt: 'after years of flexbox gymnastics, subgrid totally rewired how i think about layout. a lil love letter.',
    tags: ['css'],
  },
  {
    slug: 'leaving-the-comfort-of-the-framework',
    title: 'leaving the comfort of the framework',
    date: 'MAY 30',
    kicker: 'CAREER',
    readMinutes: 6,
    excerpt: 'i spent a month building with zero dependencies. humbling, slow, and the best thing for my fundamentals.',
    tags: ['career'],
  },
  {
    slug: 'deleting-40kb-of-javascript',
    title: 'deleting 40kb of javascript',
    date: 'APR 12',
    kicker: 'PERF',
    readMinutes: 2,
    excerpt: 'the fastest code is the code you never send. a quick audit that paid off immediately.',
    tags: ['performance'],
  },
  {
    slug: 'the-keyboard-is-the-canary',
    title: 'the keyboard is the canary',
    date: 'MAR 03',
    kicker: 'A11Y',
    readMinutes: 5,
    excerpt: 'unplug the mouse and tab through your app. if focus gets lost, everything else is already broken.',
    tags: ['accessibility'],
  },
];
