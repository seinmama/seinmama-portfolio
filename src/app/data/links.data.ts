import { QuickLink } from '../core/models';

// Placeholder URLs — swap these for real profile/resume links.
export const QUICK_LINKS: readonly QuickLink[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/', icon: '🔗', meta: '@jordanavery' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/', icon: '🔗', meta: 'in/jordanavery' },
  { id: 'writing', label: 'Writing', href: '/site/blog', icon: '🔗', meta: '/journal' },
  { id: 'rss', label: 'RSS feed', href: '/feed.xml', icon: '🔗', meta: '/feed.xml' },
];
