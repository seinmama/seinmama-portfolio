import { Audience } from '../core/models';

export const AUDIENCES: readonly Audience[] = [
  { id: 'recruiter', name: 'Recruiter', description: "I'm hiring and want the highlight reel." },
  { id: 'developer', name: 'Developer', description: 'I want to see the code and how it works.' },
  { id: 'designer', name: 'Designer', description: 'I care about craft, detail, and polish.' },
  { id: 'curious', name: 'Just curious', description: 'No agenda, just poking around.' },
];
