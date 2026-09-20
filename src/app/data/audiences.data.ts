import { Audience } from '../core/models';

export const AUDIENCES: readonly Audience[] = [
  { id: 'recruiter', name: 'Recruiter', description: 'the professional highlights', icon: '💼' },
  { id: 'friend', name: 'Friend', description: 'the fun, personal stuff', icon: '🧡' },
  { id: 'developer', name: 'Fellow dev', description: 'builds, code & writing', icon: '💻' },
  { id: 'curious', name: 'Just curious', description: 'the full tour', icon: '👀' },
  { id: 'guru', name: 'Guru', description: 'drop me into terminal mode ⌨', icon: '🧘' },
];
