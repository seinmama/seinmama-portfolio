export type AudienceId = 'recruiter' | 'friend' | 'developer' | 'curious' | 'guru';

export interface Audience {
  id: AudienceId;
  name: string;
  description: string;
  icon: string;
  photoUrl?: string;
}
