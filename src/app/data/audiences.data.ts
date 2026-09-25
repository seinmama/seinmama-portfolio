import { Audience } from '../core/models';

export const AUDIENCES: readonly Audience[] = [
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'the professional highlights',
    icon: '💼',
    photoUrl: 'profiles/recruiter.jpg',
  },
  { id: 'friend', name: 'Friend', description: 'the fun, personal stuff', icon: '🧡', photoUrl: 'profiles/friend.jpg' },
  {
    id: 'developer',
    name: 'Fellow dev',
    description: 'builds, code & writing',
    icon: '💻',
    photoUrl: 'profiles/developer.jpg',
  },
  { id: 'curious', name: 'Just curious', description: 'the full tour', icon: '👀', photoUrl: 'profiles/curious.jpg' },
  {
    id: 'guru',
    name: 'Guru',
    description: 'drop me into terminal mode ⌨',
    icon: '🧘',
    photoUrl: 'profiles/guru.jpg',
  },
];
